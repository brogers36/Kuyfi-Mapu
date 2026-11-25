# Kuyfi Mapu

*Kuyfi Mapu* is the second game of the *Kewün Newen* trilogy, a retro RPG for learning Mapudungun. A voice is carrying words away; the hero is pulled from the present-day lof into the past, into the youth of their own grandparents (young Liwen is their kuku), lives a year there from pukem to pukem recovering what is missing, and finally follows the voice into a cyberpunk future to take the stolen words back. Grammar: combos with the party (-yu, -iñ), area spells (-pe), declarations (-a-), undoing (-we-la-), associated motion (-me-, -pa-), reported speech (-rke-) and conditional triggers (-l-).

The design document is `docs/Kuyfi_Mapu_diseno.docx`.

## Status

Milestone 1 (engine): forked from the Kewün Newen engine. New in battle:
- **Liwen**, the first partner, fights beside the hero (her own health bar; enemies may hit her).
- **Iñchiw**: build a -yu combo with Liwen (ülkantuyu, trawüyu, wüñotrekayu, awkantuyu, kintuyu, nütramkayu). Wrong person endings are explained.
- **Kimün**: the -ke- reading of an enemy's habit (…key vs …ken vs …keymi).
- **Kolokolo** test boss (placeholder art), reachable from the master copy: «Kuyfi · Pukem · Kolokolo».

**Intro film:** `www/intro.mp4` (34 s) plays at the start of a new game, skippable; it is composed from in-engine shots by `tools/film/kuyfi/` scripts.

**Pukem, the first world:** its own snowy maps (`tools/kuyfi_maps.py` → `src/kuyrows.js`): the fog road, the Pukem lof (Liwen's, the kimche kuku's and the empty ruka), Pire mawida (snow forest, a konew door), Pukem menoko (frozen wetland, the -ke- stone) and Winkul (the hill, a kütral). Under the empty ruka, the Kolokolo's burrow: three new floors (seasons braziers, stone blocks and plates, season stones, a key, a konew, two minibosses, the -yu- stone) and the den. The past is drawn with its own old-photograph look; the opening is the only scene set in Game 1's lof.

## Build

    python3 build.py           # player version -> www/index.html
    python3 build.py --master  # testing copy  -> master/index.html

© 2026 Brandon M. A. Rogers. All rights reserved.
