  var svgn = 'http://www.w3.org/2000/svg';

  function getProxy(x, y, w, h, deg) {
    var c = {
        x: x + w / 2,
        y: y + h / 2
      },
      points = [],
      r;
    r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 2;
    deg = deg * Math.PI / 180;
    var deg1 = (Math.PI - Math.acos((w / 2) / r)) - parseFloat(deg),
      deg2 = Math.acos((w / 2) / r) - parseFloat(deg),
      deg3 = -Math.acos((w / 2) / r) - parseFloat(deg),
      deg4 = Math.PI + Math.acos((w / 2) / r) - parseFloat(deg);
    points.push({
      x: c.x + r * Math.cos(deg1),
      y: c.y - r * Math.sin(deg1)
    });
    points.push({
      x: c.x + r * Math.cos(deg2),
      y: c.y - r * Math.sin(deg2)
    });
    points.push({
      x: c.x + r * Math.cos(deg3),
      y: c.y - r * Math.sin(deg3)
    });
    points.push({
      x: c.x + r * Math.cos(deg4),
      y: c.y - r * Math.sin(deg4)
    });
    return points;
  }

  function getProxyEllipse(cx, cy, rx, ry, deg) {
    var points = [];

    deg = deg * Math.PI / 180;
    points.push({
      x: cx - rx * Math.cos(deg),
      y: cy - rx * Math.sin(deg)
    });
    points.push({
      x: points[0].x + 2 * rx * Math.cos(deg),
      y: points[0].y + 2 * rx * Math.sin(deg)
    });
    return points;
  }

  function convertRect(rects, context) {
    var len = rects.length,
      x, y, w, h, deg = 0,
      proxy = [],
      tran, tranParam = [],
      pathObj, node;
    if (len < 1) {
      return;
    }

    for (var n = 0; n < len; n++) {
      node = rects.item(n);
      x = +node.getAttribute("x");
      y = +node.getAttribute("y");
      w = +node.getAttribute("width");
      h = +node.getAttribute("height");
      tran = node.getAttribute("transform");

      if (tran && tran.indexOf("matrix") !== -1) {
        tranParam = tran.replace(/^matrix\s*\(([\d.\s-]+)\)/g, "$1").split(/\s|,/);
      }

      if (tranParam.length > 0) {
        deg = Math.acos(tranParam[0]) * 180 / Math.PI;
        if (tranParam[tranParam.length - 1] > 0) {
          deg *= -1;
        }
      }
      proxy = getProxy(x, y, w, h, deg);
      pathObj = context.createElementNS(svgn, "path");
      pathObj.setAttribute("d", "M" + proxy[0].x.toFixed(3) + " " + proxy[0].y.toFixed(3) + " L" + proxy[1].x.toFixed(3) + " " + proxy[1].y.toFixed(3) + " L" + proxy[2].x.toFixed(3) + " " + proxy[2].y.toFixed(3) + " L" + proxy[3].x.toFixed(3) + " " + proxy[3].y.toFixed(3) + " Z");
      pathObj.setAttribute("fill", "#000");
      node.parentNode.insertBefore(pathObj, node);
    }
    while (rects.length > 0) {
      rects.item(0).parentNode.removeChild(rects.item(0));
    }
  }

  function convertCircle(circles, context) {
    var len = circles.length,
      cx, cy, r, pathObj, node;
    if (len < 1) {
      return;
    }

    for (var n = 0; n < len; n++) {
      node = circles.item(n);
      cx = +node.getAttribute("cx");
      cy = +node.getAttribute("cy");
      r = +node.getAttribute("r");
      pathObj = context.createElementNS(svgn, "path");
      pathObj.setAttribute("d", "M" + (cx - r).toFixed(3) + " " + cy.toFixed(3) + " A" + r.toFixed(3) + " " + r.toFixed(3) + " 0 1 0 " + (cx + r).toFixed(3) + " " + cy.toFixed(3) + " A" + r.toFixed(3) + " " + r.toFixed(3) + " 0 1 0 " + (cx - r).toFixed(3) + " " + cy.toFixed(3) + " Z");
      pathObj.setAttribute("fill", "#000");
      node.parentNode.insertBefore(pathObj, node);
    }
    while (circles.length > 0) {
      circles.item(0).parentNode.removeChild(circles.item(0));
    }
  }

  function convertEllipse(ellipses, context) {
    var len = ellipses.length,
      cx, cy, rx, ry, deg = 0,
      tran, tranParam = [],
      pathObj, node;
    if (len < 1) {
      return;
    }

    for (var n = 0; n < len; n++) {
      node = ellipses.item(n);
      cx = +node.getAttribute("cx");
      cy = +node.getAttribute("cy");
      rx = +node.getAttribute("rx");
      ry = +node.getAttribute("ry");
      tran = node.getAttribute("transform");
      pathObj = context.createElementNS(svgn, "path");
      if (tran && tran.indexOf("matrix") !== -1) {
        tranParam = tran.replace(/^matrix\s*\(([\d.\s-]+)\)/g, "$1").split(/\s|,/);
      }
      if (tranParam.length > 0) {
        deg = Math.acos(tranParam[0]) * 180 / Math.PI;
        if (tranParam[tranParam.length - 1] > 0) {
          deg *= -1;
        }
      }
      points = getProxyEllipse(cx, cy, rx, ry, deg);
      pathObj.setAttribute("d", "M" + points[0].x.toFixed(3) + " " + points[0].y.toFixed(3) + " A" + rx.toFixed(3) + " " + ry.toFixed(3) + " " + deg.toFixed(3) + " 1 0 " + points[1].x.toFixed(3) + " " + points[1].y.toFixed(3) + " A" + rx.toFixed(3) + " " + ry.toFixed(3) + " " + deg.toFixed(3) + " 1 0 " + points[0].x.toFixed(3) + " " + points[0].y.toFixed(3) + " Z");
      pathObj.setAttribute("fill", "#000");
      node.parentNode.insertBefore(pathObj, node);
    }
    while (ellipses.length > 0) {
      ellipses.item(0).parentNode.removeChild(ellipses.item(0));
    }
  }

  function convertPolygon(polygons, context) {
    var len = polygons.length,
      points, pathObj, data, node;
    if (len < 1) {
      return;
    }

    for (var n = 0; n < len; n++) {
      node = polygons.item(n);
      points = node.getAttribute("points").split(/\s|,/);
      data = "M" + points[0] + " " + points[1];
      points = points.slice(2);
      for (var i = 0, size = points.length - 2; i < size; i += 2) {
        data += " L" + points[i] + " " + points[i + 1];
      }
      pathObj = context.createElementNS(svgn, "path");
      pathObj.setAttribute("d", data + " Z");
      pathObj.setAttribute("fill", "#000");
      node.parentNode.insertBefore(pathObj, node);
    }
    while (polygons.length > 0) {
      polygons.item(0).parentNode.removeChild(polygons.item(0));
    }
  }

  function mergePath(parent) {
    var paths = parent.getElementsByTagName("path"),
      len = paths.length,
      d = "";
    if (len < 1) {
      return;
    }

    d = paths.item(0).getAttribute("d");

    for (var n = 1; n < len; n++) {
      d += " " + paths.item(n).getAttribute("d");
    }
    while (paths.length > 1) {
      paths.item(1).parentNode.removeChild(paths.item(1));
    }
    paths.item(0).setAttribute("d", d);
  }
  window.convertToPath = function(svgString) {
    var doc, svg, rects, circles, ellipses, polygons, xml;
    doc = new DOMParser().parseFromString(svgString, "text/xml");
    svg = doc.getElementsByTagName("svg")[0];

    rects = svg.getElementsByTagName("rect");
    circles = svg.getElementsByTagName("circle");
    ellipses = svg.getElementsByTagName("ellipse");
    polygons = svg.getElementsByTagName("polygon");

    convertRect(rects, doc);
    convertCircle(circles, doc);
    convertEllipse(ellipses, doc);
    convertPolygon(polygons, doc);
    mergePath(svg);

    xml = new XMLSerializer().serializeToString(doc);
    return {
      svg: xml,
      path: doc.getElementsByTagName('path')[0].attributes['0'].nodeValue
    };
  };
