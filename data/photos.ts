import architecture from "@/data/photos/architecture.json";
import blackAndWhite from "@/data/photos/black-and-white.json";
import documentary from "@/data/photos/documentary.json";
import food from "@/data/photos/food.json";
import landscape from "@/data/photos/landscape.json";
import macro from "@/data/photos/macro.json";
import miscellaneous from "@/data/photos/miscellaneous.json";
import nature from "@/data/photos/nature.json";
import night from "@/data/photos/night.json";
import portrait from "@/data/photos/portrait.json";
import stillLife from "@/data/photos/still-life.json";
import street from "@/data/photos/street.json";
import travel from "@/data/photos/travel.json";
import wildlife from "@/data/photos/wildlife.json";
import type { Photo } from "@/types/photography";

// Category JSON files are validated by `npm run photos:validate` before builds.
const groups = [street, nature, landscape, travel, portrait, architecture, wildlife, macro, food, night, blackAndWhite, documentary, stillLife, miscellaneous];

export const photos = groups.flat() as Photo[];
