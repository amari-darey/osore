import OsoreActorSheet from "./actor_sheet.js"


Hooks.on("init", () => {
    console.log("osore | Initialising OSORE System")

    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("osore", OsoreActorSheet, {
        types: ["Survivor"],
        makeDefault: true
    });
});

Hooks.once('ready', async function () {
    console.log("osore | Ready OSORE System")
})