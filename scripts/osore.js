import OsoreActorSheet from "./actor_sheet.js"


Hooks.on("init", () => {
    console.log("osore | Initialising OSORE System")
    Actors.registerSheet("osore", OsoreActorSheet, {
        types: ["Survivor"],
        makeDefault: true
    });
});