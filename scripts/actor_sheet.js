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
}