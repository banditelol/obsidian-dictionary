import { FuzzySuggestModal, App } from "obsidian";
import SynonymProviderChooser from "src/ui/modals/synonymProviderChooser";
import type DictionaryPlugin from "src/main";

export default class DefinitionProviderChooser extends FuzzySuggestModal<string>{
    plugin: DictionaryPlugin;
    available: string[] = [];

    constructor(app: App, plugin: DictionaryPlugin) {
        super(app);
        this.plugin = plugin;
        this.plugin.manager.definitionProvider.forEach((api) => {
            if(api.supportedLanguages.contains(this.plugin.settings.defaultLanguage)){
                this.available.push(api.name);
            }
        });
    }

    async onOpen(): Promise<void> {
        if (this.available.length <= 1) {
            this.onChooseItem(this.available.first()??"");
        }
    }

    getItems(): string[] {
        return this.available;
    }

    getItemText(item: string): string {
        return item;
    }

    async onChooseItem(item: string): Promise<void> {
        this.plugin.settings.definitionApiName = item;
        await this.plugin.saveSettings();
        this.close();
        new SynonymProviderChooser(this.app, this.plugin).open();
    }

}