# Kuyfi Mapu

*Kuyfi Mapu* is the second game of the *Kewün Newen* trilogy, a retro RPG for learning Mapudungun. The hero follows the Ngoyman's echo into kuyfi time and lives a full year with the ancestors' lof, from pukem to pukem, learning to speak with others: combos with the party (-yu, -iñ), area spells (-pe), declarations (-a-), undoing (-we-la-), associated motion (-me-, -pa-), reported speech (-rke-) and conditional triggers (-l-).

The design document is `docs/Kuyfi_Mapu_diseno.docx`.

## Status

Milestone 1 (engine): forked from the Kewün Newen engine. New in battle:
- **Liwen**, the first partner, fights beside the hero (her own health bar; enemies may hit her).
- **Iñchiw**: build a -yu combo with Liwen (ülkantuyu, trawüyu, wüñotrekayu, awkantuyu, kintuyu, nütramkayu). Wrong person endings are explained.
- **Kimün**: the -ke- reading of an enemy's habit (…key vs …ken vs …keymi).
- **Kolokolo** test boss (placeholder art), reachable from the master copy: «Kuyfi · Pukem · Kolokolo».

The Game 1 world is still in place underneath while the Pukem region is built.

## Build

    python3 build.py           # player version -> www/index.html
    python3 build.py --master  # testing copy  -> master/index.html

© 2026 Brandon M. A. Rogers. All rights reserved.
