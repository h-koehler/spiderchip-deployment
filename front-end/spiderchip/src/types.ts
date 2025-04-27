import { StoryBeatType } from "./components/StoryDefinitions";

export enum LevelItemType {
    PUZZLE,
    STORY,
}

export enum LevelStatus {
    COMPLETED = "completed",
    SKIPPED = "skipped",
    AVAILABLE = "available",
    LOCKED = "locked"
}

export type LevelItem<LevelType = LevelItemType> =
    LevelType extends LevelItemType.PUZZLE ? {
        type: LevelType;
        id: number; // NOTE: only unique within puzzles - see getUniqueLevelItemKey
        title: string;
        description: string;
        status: LevelStatus;
    } : LevelType extends LevelItemType.STORY ? {
        type: LevelType;
        id: number; // NOTE: only unique within stories - see getUniqueLevelItemKey
        level: number;
        storyType: StoryBeatType;
        description: string;
        status: LevelStatus; // should really only ever be AVAILABLE or LOCKED
    } : {
        type: never;
    }

export function getUniqueLevelItemKey(a: LevelItem): string {
    return a.type + "_" + a.id
}

export function compareLevelItems(a: LevelItem, b: LevelItem): number {
    if (a.type === LevelItemType.PUZZLE && b.type === LevelItemType.PUZZLE) {
        // puzzles just get ordered by the puzzle number
        return a.id - b.id;
    } else if (a.type === LevelItemType.PUZZLE && b.type === LevelItemType.STORY) {
        // stories queue up behind the associated puzzle
        return a.id <= b.level ? -1 : 1;
    } else if (a.type === LevelItemType.STORY && b.type === LevelItemType.PUZZLE) {
        // ditto as above
        return a.level > b.id ? -1 : 1;
    } else if (a.type === LevelItemType.STORY && b.type === LevelItemType.STORY) {
        // stories just get ordered by the story order
        return a.id - b.id;
    } else {
        throw new Error("Unknown comparison when comparing level items");
    }
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
