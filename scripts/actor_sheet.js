export default class OsoreActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["osore", "sheet", "actor", "osore-sheet"],
      template: "systems/osore/templates/actor-sheet.html",
      width: 840,
      height: 850,
      resizable: true,
      minimizable: true,
      tabs: [{ nav: ".sheet-tabs", content: ".sheet-body", initial: "main" }]
    });
  }

  getData() {
    const data = super.getData();

    const currentChar = data.actor.system.activeCharacter;
    const charKey = `character_${currentChar}`;
    const current = foundry.utils.getProperty(this.actor.system, charKey) || {};

    const cellsFromValue = (v) => {
      const value = Number(v ?? 0);
      const pos = 3 - value; //value 3 => pos 0, value 0 => pos 3, value -3 => pos 6
      return Array.from({ length: 7 }, (_, i) => i === pos);
    };

    const stats = current.stats;

    data.current = current;
    data.activePath = `system.character_${currentChar}`;
    data.isActive1 = currentChar === 1;
    data.isActive2 = currentChar === 2;
    data.isActive3 = currentChar === 3;
    data.isActive4 = currentChar === 4;

    data.cells = {
      complexion: cellsFromValue(stats.complexion.value),
      mind:       cellsFromValue(stats.mind.value),
      character:  cellsFromValue(stats.character.value),
      endurance:  cellsFromValue(stats.endurance.value)
    };
    console.log(data.cells)

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".character-switcher .char-btn").click(async ev => {
      ev.preventDefault();
      const newChar = Number(ev.currentTarget.dataset.character);
      if (!newChar || newChar < 1 || newChar > 4) return;
      this.actor.system.activeCharacter = newChar;
      this.render(true);
    });

    requestAnimationFrame(() => this._drawGraphLines(html));
  }

  _drawGraphLines(html) {
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
}
