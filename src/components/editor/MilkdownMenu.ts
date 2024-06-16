import {
    Editor,
    editorViewCtx,
    commandsCtx,
    schemaCtx,
    editorStateCtx,
} from "@milkdown/core";
import { $prose, $command } from "@milkdown/utils";
import { Plugin } from "@milkdown/prose/state";

import "../../components/editor/ElementInternalPolyfill.ts";

const menu = $prose(
    (ctx) =>
        new Plugin({
            view: (_) => ({
                update: () => {
                    const state = ctx.get(editorStateCtx);
                    const marks = ctx.get(schemaCtx).marks;
                    const { from, $from, to, empty } = state.selection;
                    document
                        .querySelector(
                            '.milkdown-menu .milkdown-menu-button > button[data-key="ToggleStrong"]'
                        )
                        ?.classList.toggle(
                            "active",
                            empty
                                ? !!marks.strong.isInSet(
                                      state.storedMarks || $from.marks()
                                  )
                                : state.doc.rangeHasMark(from, to, marks.strong)
                        );
                    document
                        .querySelector(
                            '.milkdown-menu .milkdown-menu-button > button[data-key="ToggleEmphasis"]'
                        )
                        ?.classList.toggle(
                            "active",
                            empty
                                ? !!marks.emphasis.isInSet(
                                      state.storedMarks || $from.marks()
                                  )
                                : state.doc.rangeHasMark(from, to, marks.strong)
                        );
                    document
                        .querySelector(
                            '.milkdown-menu .milkdown-menu-button > button[data-key="ToggleStrikeThrough"]'
                        )
                        ?.classList.toggle(
                            "active",
                            empty
                                ? !!marks.strike_through.isInSet(
                                      state.storedMarks || $from.marks()
                                  )
                                : state.doc.rangeHasMark(
                                      from,
                                      to,
                                      marks.strike_through
                                  )
                        );
                },
            }),
        })
);

const menuListener = (editor: Editor) => {
    document
        .querySelectorAll(".milkdown-menu .milkdown-menu-select > button")
        .forEach((button) => {
            const ul = button.nextElementSibling as HTMLUListElement | null;
            const toggleMenu = (expanded: boolean) => {
                if (expanded) {
                    button.ariaExpanded = "true";
                    ul?.classList.add("show");
                    editor.ctx
                        .get(editorViewCtx)
                        .dom.addEventListener("click", onClickOutside);
                } else {
                    button.ariaExpanded = "false";
                    ul?.classList.remove("show");
                    ul?.blur();
                    editor.ctx
                        .get(editorViewCtx)
                        .dom.removeEventListener("click", onClickOutside);
                }
            };
            const onClickOutside = (_: Event) => toggleMenu(false);

            button.addEventListener("click", (_) => {
                toggleMenu(button.ariaExpanded === "true" ? false : true);
            });

            ul?.querySelectorAll("li").forEach((li) => {
                li.addEventListener("click", (e) => {
                    const id = Number(
                        (e.target as HTMLLIElement).getAttribute("data-id")
                    );
                    if (id) {
                        console.log(`Call command: WrapInHeading ${id}`);
                        editor.ctx.get(commandsCtx).call("WrapInHeading", id);
                    } else {
                        console.log(`Call command: TurnIntoText`);
                        editor.ctx.get(commandsCtx).call("TurnIntoText");
                    }
                    toggleMenu(false);
                });
            });
        });
    document
        .querySelectorAll(".milkdown-menu .milkdown-menu-button > button")
        .forEach((button) => {
            button.addEventListener("click", (e) => {
                const key = (e.target as HTMLButtonElement).getAttribute(
                    "data-key"
                );
                console.log(`Call command: ${key}`);
                if (key) editor.ctx.get(commandsCtx).call(key);
            });
        });
};

export { menu, menuListener };
