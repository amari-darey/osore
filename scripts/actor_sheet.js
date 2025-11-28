import { REVERS_DICE, SCHEME, PARAMETRS, TRANSLATE } from "./constant.js";
import { parseString, drawGraphLines, askOrder, getResultHtml, getChooseSchemeHtml} from "./utils.js"


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

    async _updateObject(event, formData) {
        return await this.actor.update(formData);
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".character-switcher .char-btn").click(async ev => {
            ev.preventDefault();
            const newChar = Number(ev.currentTarget.dataset.character);
            if (!newChar || newChar < 1 || newChar > 4) return;
            await this.actor.update({ "system.activeCharacter": newChar });
            await this._updateTokenImage(newChar);
        });

        html.find(".button-schema-image").click(async ev => {
            ev.preventDefault();
            this.filling_character_sheet()
        })

        html.find(".stat-name").click(async el => this._rollStat(el.currentTarget.dataset.stat))

        html.find(".avatar-select").click(ev => this._onAvatarSelect(ev));

        requestAnimationFrame(() => drawGraphLines(html));
    }

    getCurrentCharacter() {
        const data = this.actor.system;
        const currentChar = data.activeCharacter;
        const charKey = `character_${currentChar}`;
        const current = foundry.utils.getProperty(this.actor.system, charKey);
        return current
    }

    async _updateTokenImage(char) {
        const current = this.getCurrentCharacter()

        await this.actor.update({
            img: current.image_path,
            "prototypeToken.texture.src": current.image_path
        });

        const tokens = this.actor.getActiveTokens();
        for (const token of tokens) {
            await token.document.update({ "texture.src": current.image_path });
        }
    }

    async _onAvatarSelect(event) {
        event.preventDefault();

        const current = this.getCurrentCharacter();
        const currentImg = current.image_path;

        const fp = new FilePicker({
            type: "image",
            current: currentImg,
            callback: async (path) => {
                
                await this.actor.update({
                    [`system.character_${current.id}.image_path`]: path,
                    img: path,
                    "prototypeToken.texture.src": path
                });

                for (const t of this.actor.getActiveTokens()) {
                    await t.document.update({ "texture.src": path });
                }

                this.render(true);
            }
        });

        fp.browse();
    }

    async filling_character_sheet() {
        let result_message = {
            "parameters": []
        }

        const current = this.getCurrentCharacter()
        if (!current) return

        const roll = new Roll("4d20");
        await roll.evaluate();
        if (!roll) return

        const result_roll = roll.terms[0].results.map(r => r.result)
        const revers_result_roll = result_roll.map(r => REVERS_DICE[r])

        result_message["rolls"] = result_roll

        result_roll[0] = await this._chooseSchemeNumber(result_roll[0])

        const schema = SCHEME[result_roll[0]]
        result_message["scheme"] = result_roll[0]

        let updatedData = foundry.utils.duplicate(current);
        updatedData.schema = result_roll[0]
        const links = ["link1", "link2", "link3"]
        for (let index = 0; index < 3; index++) {
            if (![4, 8, 12, 16, 20].includes(result_roll[0])) {
                const parametrs = await askOrder(schema[links[index]], result_roll[index+1])
                if (!parametrs) return
                
                const highParametrName = parametrs[0]
                const lowParametrName = parametrs[1]

                const highParametrValue = PARAMETRS[highParametrName][result_roll[index+1]]
                const lowParametrValue = PARAMETRS[lowParametrName][revers_result_roll[index+1]]

                foundry.utils.setProperty(updatedData, `info.${highParametrName}`, highParametrValue.value)
                foundry.utils.setProperty(updatedData, `info.${lowParametrName}`, lowParametrValue.value)

                const highParametrMod = parseString(highParametrValue.modified)
                const lowParametrMod = parseString(lowParametrValue.modified)
                
                let text_modifier1 = highParametrMod.text
                if (!text_modifier1) text_modifier1 = "not"

                let text_modifier2 = lowParametrMod.text
                if (!text_modifier2) text_modifier2 = "not"

                result_message.parameters.push(
                    {
                        "name": TRANSLATE[highParametrName],
                        "value": highParametrMod.number,
                        "modifier": TRANSLATE[text_modifier1]
                    }
                )
                result_message.parameters.push(
                    {
                        "name": TRANSLATE[lowParametrName],
                        "value": lowParametrMod.number,
                        "modifier": TRANSLATE[text_modifier2]
                    }
                )

                this._setModifier(updatedData, highParametrMod)
                this._setModifier(updatedData, lowParametrMod)
            }
        }
        await this.actor.update({ [`system.character_${current.id}`]: updatedData });
        this._show_message(result_message)
    }

    _setModifier(updatedData, modifier) {
        let textModifier = modifier.text
        if (!textModifier) textModifier = "not"
        if (modifier.text) {
            if (modifier.text != "all") {
                const path = `stats.${modifier.text}.value`;
                this._set_stats(updatedData, path, modifier)
            } else {
                ["complexion", "mind", "character", "endurance"].forEach((item) => {
                    const path = `stats.${item}.value`;
                    this._set_stats(updatedData, path, {"number": modifier.number, "text": item})
                });
            }
        }
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
            const content = getChooseSchemeHtml(title, options, hint)

            const dlg = new Dialog({
                title: "",
                content,
                buttons: {
                    cancel: {
                        label: "Отмена",
                        callback: () => reject("cancelled")
                    }
                },
                default: "cancel",
                render: html => {
                    html.find(".osore-pick-button").click(ev => {
                        const value = ev.currentTarget.dataset.value;
                        dlg.close();
                        resolve(value);
                    });

                    if (showBackButton) {
                        const backButton = $(`<button class="osore-back-button">Назад</button>`);
                        html.find(".osore-pick-buttons").prepend(backButton);
                        backButton.click(() => {
                            dlg.close();
                            reject("back");
                        });
                    }
                },
                classes: ["osore-dialog"]
            });

            dlg.render(true);
        });
    }

    async _chooseSchemeNumber(schemaRoll) {
        let result = schemaRoll
        if (result == 4) {
            result = await this._pick("Выберите схему", ["1", "2", "3"])
        } else if (result == 8) {
            result = await this._pick("Выберите схему", ["5", "6", "7"])
        }
        else if (result == 12) {
            result = await this._pick("Выберите схему", ["9", "10", "11"])
        }
        else if (result == 16) {
            result = await this._pick("Выберите схему", ["13", "14", "15"])
        }
        else if (result == 20) {
            result = await this._pick("Выберите схему", ["17", "18", "19"])
        }
        return result
    }

    _show_message(result) {
        if (!result || typeof result !== "object") return;

        const { scheme, rolls = [], parameters = [] } = result;

        const content = getResultHtml(scheme, rolls, parameters)

        new Dialog({
            title: "Создание персонажа",
            content,
            buttons: {
                close: {
                    label: "Закрыть"
                }
            }
        }).render(true);
    }

    async _rollStat(stat) {
        const current = this.getCurrentCharacter()
        const skill = foundry.utils.getProperty(current, `stats.${stat}`);
        if (skill) {
            let update = {}
            const roll = new Roll(`1d20+${skill.value}`);
            await roll.evaluate();
            const success = roll.total >= current.roll_difficult;
            if (success) {
                update[`system.character_${current.id}.roll_difficult`] = REVERS_DICE[roll.terms[0].results[0].result];
            } else {
                update[`system.character_${current.id}.roll_difficult`] = 10
                if (!current.status.threat1) {
                    update[`system.character_${current.id}.status.threat1`] = true;
                } else if (!current.status.threat2) {
                    update[`system.character_${current.id}.status.threat2`] = true;
                } else if (!current.status.threat3) {
                    update[`system.character_${current.id}.status.threat3`] = true;
                }
            }
            await this.actor.update(update);
            const resultHtml = `
                <div style="
                    padding: 8px 12px;
                    border-radius: 6px;
                    margin-top: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    color: white;
                    text-align: center;
                    background: ${success ? "#2ecc71" : "#e74c3c"};
                ">
                    ${success ? "УСПЕХ" : "ПРОВАЛ"}
                </div>
            `;
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: `
                    ${current.info.name}:
                    Проверка навыка: <b>${TRANSLATE[stat]}</b>
                    ${resultHtml}
                `,
            });
        } else {
            console.error("Skill is", skill)
        }
        this.render(true);
    }
}
