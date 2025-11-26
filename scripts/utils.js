export function parseString(input) {
        if (!input) return { number: 0, text: '' };
        
        const numMatch = input.match(/^[+-]?\d+/);
        const number = numMatch ? parseInt(numMatch[0], 10) : 0;
        const text = input.replace(/^[+-]?\d+/, '');
        
        return { number, text };
    }

export function drawGraphLines(html) {
    const ruler = html[0].querySelector(".ruler");
    if (!ruler) return;

    const prev = ruler.querySelector("svg.graph-overlay");
    if (prev) prev.remove();

    const groups = Array.from(ruler.querySelectorAll(".group"));
    if (groups.length === 0) return;

    const points = [];
    groups.forEach(group => {
      const activeCircle = group.querySelector(".cell.active .circle");
      if (activeCircle) {
        const circleRect = activeCircle.getBoundingClientRect();
        const parentRect = ruler.getBoundingClientRect();
        const x = circleRect.left - parentRect.left + circleRect.width / 2;
        const y = circleRect.top  - parentRect.top  + circleRect.height / 2;
        points.push([x, y]);
      } else {
        // pass
      }
    });

    if (points.length < 2) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.classList.add("graph-overlay");
    svg.setAttribute("width", ruler.clientWidth);
    svg.setAttribute("height", ruler.clientHeight);
    svg.setAttribute("viewBox", `0 0 ${ruler.clientWidth} ${ruler.clientHeight}`);
    svg.style.position = "absolute";
    svg.style.left = 0;
    svg.style.top = 0;
    svg.style.pointerEvents = "none";
    svg.style.overflow = "visible";

    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", "#d9534f");
    poly.setAttribute("stroke-width", "3");
    poly.setAttribute("stroke-linecap", "round");
    poly.setAttribute("stroke-linejoin", "round");
    poly.setAttribute("points", points.map(p => `${p[0]},${p[1]}`).join(" "));
    svg.appendChild(poly);

    poly.setAttribute("stroke-opacity", "0.95");

    ruler.appendChild(svg);
  }
  