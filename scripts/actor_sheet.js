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

  getData(options = {}) {
    const data = super.getData(options);

    const currentChar = this.actor.getFlag("osore", "currentChar") || 1;

    const activePath = `system.character_${currentChar}`;

    const current = foundry.utils.getProperty(this.actor.system, `character_${currentChar}`) || {};

    data.currentChar = currentChar;
    data.activePath = activePath;
    data.current = current;
    data.isActive1 = currentChar === 1;
    data.isActive2 = currentChar === 2;
    data.isActive3 = currentChar === 3;
    data.isActive4 = currentChar === 4;

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".character-switcher .char-btn").click(async ev => {
      ev.preventDefault();
      const newChar = Number(ev.currentTarget.dataset.character);
      if (!newChar || newChar < 1 || newChar > 4) return;
      await this.actor.setFlag("osore", "currentChar", newChar);
      this.render(true);
    });
  }
}