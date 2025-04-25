export interface LevelItem {
    id: number | string;
    title: string;
    description: string;
}

export enum LineHighlightType {
    DEBUG = "debug",
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning"
}

export interface LineHighlight {
    line: number;
    type: LineHighlightType;
}
