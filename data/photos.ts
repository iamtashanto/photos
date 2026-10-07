import { architecturePhotos } from "@/data/photos/architecture";
import { blackAndWhitePhotos } from "@/data/photos/black-and-white";
import { documentaryPhotos } from "@/data/photos/documentary";
import { foodPhotos } from "@/data/photos/food";
import { landscapePhotos } from "@/data/photos/landscape";
import { macroPhotos } from "@/data/photos/macro";
import { miscellaneousPhotos } from "@/data/photos/miscellaneous";
import { naturePhotos } from "@/data/photos/nature";
import { nightPhotos } from "@/data/photos/night";
import { portraitPhotos } from "@/data/photos/portrait";
import { stillLifePhotos } from "@/data/photos/still-life";
import { streetPhotos } from "@/data/photos/street";
import { travelPhotos } from "@/data/photos/travel";
import { wildlifePhotos } from "@/data/photos/wildlife";
import type { Photo } from "@/types/photography";

// Add new photographs to the matching category file in data/photos/.
export const photos: Photo[] = [
  ...streetPhotos,
  ...naturePhotos,
  ...landscapePhotos,
  ...travelPhotos,
  ...portraitPhotos,
  ...architecturePhotos,
  ...wildlifePhotos,
  ...macroPhotos,
  ...foodPhotos,
  ...nightPhotos,
  ...blackAndWhitePhotos,
  ...documentaryPhotos,
  ...stillLifePhotos,
  ...miscellaneousPhotos,
];
