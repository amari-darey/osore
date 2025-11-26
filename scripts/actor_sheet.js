import { REVERS_DICE, SCHEME, PARAMETRS } from "./constant.js";
import { parseString, drawGraphLines} from "./utils.js"


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
            mind: cellsFromValue(stats.mind.value),
            character: cellsFromValue(stats.character.value),
            endurance: cellsFromValue(stats.endurance.value)
        };

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

        html.find(".button-schema-image").click(async ev => {
            ev.preventDefault();
            this.filling_character_sheet()
        })

        requestAnimationFrame(() => drawGraphLines(html));
    }

    async filling_character_sheet() {
        const data = this.actor.system;
        const currentChar = data.activeCharacter;
        const charKey = `character_${currentChar}`;
        const current = foundry.utils.getProperty(this.actor.system, charKey);
        if (!current) return
        const roll = new Roll("4d20");
        await roll.evaluate();
        const result_roll = roll.terms[0].results.map(r => r.result)
        const revers_result_roll = result_roll.map(r => REVERS_DICE[r])
        console.log(result_roll, revers_result_roll)

        const schema = SCHEME[result_roll[0]]

        let updatedData = foundry.utils.duplicate(current);
        const links = ["link1", "link2", "link3"]
        for (let index = 0; index < 3; index++) {
            if (![4, 8, 12, 16, 20].includes(result_roll[0])) {
                console.log("schema not pass")
                const x = schema[links[index]][0]
                const y = schema[links[index]][1]

                const parametr1 = PARAMETRS[x][result_roll[index+1]]
                const parametr2 = PARAMETRS[y][revers_result_roll[index+1]]

                const modifier1 = parseString(parametr1.modified)
                const modifier2 = parseString(parametr2.modified)

                foundry.utils.setProperty(updatedData, `info.${x}`, parametr1.value)
                foundry.utils.setProperty(updatedData, `info.${y}`, parametr2.value)
                
                if (modifier1.text != "all"){
                    if (modifier1.text) {
                        const path = `stats.${modifier1.text}.value`;
                        const currentValue = foundry.utils.getProperty(updatedData, path);

                        console.log(`Параметр ${modifier1.text} был ${currentValue} будет ${currentValue + modifier1.number}`)

                        const meta = foundry.utils.getProperty(updatedData, `stats.${modifier1.text}`);

                        const newValue = currentValue + modifier1.number;

                        if (newValue <= meta.max && newValue >= meta.min) {
                            foundry.utils.setProperty(updatedData, path, newValue);
                        }
                    }
                    
                    if (modifier2.text) {
                        const path = `stats.${modifier2.text}.value`;
                        const currentValue = foundry.utils.getProperty(updatedData, path);

                        console.log(`Параметр ${modifier2.text} был ${currentValue} будет ${currentValue + modifier2.number}`)

                        const meta = foundry.utils.getProperty(updatedData, `stats.${modifier2.text}`);

                        const newValue = currentValue + modifier2.number;

                        if (newValue <= meta.max && newValue >= meta.min) {
                            foundry.utils.setProperty(updatedData, path, newValue);
                        }
                    }
                }
            }
        }
        await this.actor.update({ [`system.${charKey}`]: updatedData });
        console.log(this.actor.system)
        this.render(true);
    }
}
