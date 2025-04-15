export interface LevelItem {
    id: number;
    title: string;
    category: string;
    description: string;
    status: any;
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
