import { REVERS_DICE, SCHEME, PARAMETRS, TRANSLATE } from "./constant.js";
import { parseString, drawGraphLines, askOrder} from "./utils.js"


export default class OsoreActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["osore", "sheet", "actor", "osore-sheet"],
            template: "systems/osore/templates/actor-sheet.html",
            width: 840,
            height: 690,
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
        data.schema = current.schema
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

        html.find(".stat-name").click(async el => {
            const charKey = `character_${this.actor.system.activeCharacter}`;
            const current = foundry.utils.getProperty(this.actor.system, charKey);
            const skill = foundry.utils.getProperty(current, `stats.${el.currentTarget.dataset.stat}`);
            if (skill) {
                const roll = new Roll(`1d20+${skill.value}`);
                await roll.evaluate();
                if (roll.total >= current.roll_difficult) {
                    current.roll_difficult = REVERS_DICE[roll.terms[0].results[0].result]
                } else {
                    current.roll_difficult = 10
                }
                roll.toMessage({
                    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                    flavor: `Проверка навыка: <b>${TRANSLATE[el.currentTarget.dataset.stat]}</b>`,
                });
            } else {
                console.error("Skill is", skill)
            }
            this.render(true);
        })

        requestAnimationFrame(() => drawGraphLines(html));
    }

    async filling_character_sheet() {
        let result_message = ``

        const data = this.actor.system;
        const currentChar = data.activeCharacter;
        const charKey = `character_${currentChar}`;
        const current = foundry.utils.getProperty(this.actor.system, charKey);
        if (!current) return
        const roll = new Roll("4d20");
        await roll.evaluate();
        if (!roll) return
        const result_roll = roll.terms[0].results.map(r => r.result)
        const revers_result_roll = result_roll.map(r => REVERS_DICE[r])

        result_message += `Результаты бросков ${result_roll.join(" ")}\n`

        if (result_roll[0] == 4) {
            result_roll[0] = await this._pick("Выберите схему", ["1", "2", "3"])
        } else if (result_roll[0] == 8) {
            result_roll[0] = await this._pick("Выберите схему", ["5", "6", "7"])
        }
        else if (result_roll[0] == 12) {
            result_roll[0] = await this._pick("Выберите схему", ["9", "10", "11"])
        }
        else if (result_roll[0] == 16) {
            result_roll[0] = await this._pick("Выберите схему", ["13", "14", "15"])
        }
        else if (result_roll[0] == 20) {
            result_roll[0] = await this._pick("Выберите схему", ["17", "18", "19"])
        }

        const schema = SCHEME[result_roll[0]]
        current.schema = result_roll[0]
        result_message = result_message + `Схема: ${result_roll[0]}\n`

        let updatedData = foundry.utils.duplicate(current);
        const links = ["link1", "link2", "link3"]
        for (let index = 0; index < 3; index++) {
            if (![4, 8, 12, 16, 20].includes(result_roll[0])) {
                const parametrs = await askOrder(schema[links[index]], result_roll[index+1])
                const x = parametrs[0]
                const y = parametrs[1]

                const parametr1 = PARAMETRS[x][result_roll[index+1]]
                const parametr2 = PARAMETRS[y][revers_result_roll[index+1]]

                const modifier1 = parseString(parametr1.modified)
                const modifier2 = parseString(parametr2.modified)
                foundry.utils.setProperty(updatedData, `info.${x}`, parametr1.value)
                foundry.utils.setProperty(updatedData, `info.${y}`, parametr2.value)

                let text_modifier1 = modifier1.text
                if (!text_modifier1) text_modifier1 = "not"

                let text_modifier2 = modifier2.text
                if (!text_modifier2) text_modifier2 = "not"

                result_message += `${TRANSLATE[x]}: ${parametr1.value} | ${TRANSLATE[text_modifier1]}/ ${modifier1.number}\n`
                result_message += `${TRANSLATE[y]}: ${parametr2.value} | ${TRANSLATE[text_modifier2]}/ ${modifier2.number}\n`

                if (modifier1.text) {
                    if (modifier1.text != "all") {
                        const path = `stats.${modifier1.text}.value`;
                        this._set_stats(updatedData, path, modifier1)
                    } else {
                        ["complexion", "mind", "character", "endurance"].forEach((item) => {
                            const path = `stats.${item}.value`;
                            this._set_stats(updatedData, path, {"number": modifier1.number, "text": item})
                        });
                    }
                }
                if (modifier2.text) {
                    if (modifier2.text != "all") {
                        const path = `stats.${modifier2.text}.value`;
                        this._set_stats(updatedData, path, modifier2)
                    } else {
                        ["complexion", "mind", "character", "endurance"].forEach((item) => {
                            const path = `stats.${item}.value`;
                            this._set_stats(updatedData, path, {"number": modifier2.number, "text": item})
                        });
                    }
                }
                
            }
        }
        await this.actor.update({ [`system.${charKey}`]: updatedData });
        this._show_message(result_message)
    }

    _set_stats(data, path, modifier) {
        const currentValue = foundry.utils.getProperty(data, path);

        const meta = foundry.utils.getProperty(data, `stats.${modifier.text}`);

        const newValue = currentValue + modifier.number;

        if (newValue <= meta.max && newValue >= meta.min) {
            foundry.utils.setProperty(data, path, newValue);
        }
    }

    _pick(title, options = [], hint = "", showBackButton = false) {
        return new Promise((resolve, reject) => {
            const content = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        color: #e0e0e0; 
                        background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
                        padding: 20px; 
                        border-radius: 12px; 
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);">
                
                <div style="margin-bottom: 15px; padding: 12px; background: rgba(30, 30, 30, 0.7);
                            border-left: 3px solid #ff4757; border-radius: 0 8px 8px 0;
                            font-style: italic; color: #a0a0a0; font-size: 14px;">
                ${hint}
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                ${options.map((o, i) => `
                    <button class="dryh-pick-button" data-value="${o}"
                    style="padding: 12px; width: 100%; border-radius: 10px; border: none;
                            background: rgba(40, 40, 40, 0.85); 
                            color: #e0e0e0; font-size: 15px;
                            cursor: pointer; transition: all 0.25s ease;">
                    ${o}
                    </button>
                `).join("")}
                </div>
            </div>
            `;

            const buttons = {
            cancel: {
                label: "Отмена",
                callback: () => reject("cancelled")
            }
            };

            if (showBackButton) {
            buttons.back = {
                label: "Назад",
                callback: () => reject("back")
            };
            }

            const dlg = new Dialog({
            title,
            content,
            buttons,
            default: "cancel",
            render: html => {
                html.find(".dryh-pick-button").click(ev => {
                const value = ev.currentTarget.dataset.value;
                dlg.close();
                resolve(value);
                });
            }
            });

            dlg.render(true);
        });
    }

    _show_message(text) {
        text = text.replace(/\n/g, "<br>");
        const content = `
            <div style="
                padding: 15px;
                font-size: 14px;
                line-height: 1.4;
            ">
                ${text}
            </div>
        `;

        new Dialog({
            title: "Сообщение",
            content,
            buttons: {
                ok: {
                    label: "OK",
                    callback: () => {}   // просто закрыть
                }
            },
            default: "ok"
        }).render(true);
    }

}
