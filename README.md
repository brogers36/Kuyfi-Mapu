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

**Pukem, the first world:** its own snowy maps (`tools/kuyfi_maps.py` → `src/kuyrows.js`): the fog road, the Pukem lof (Liwen's, the kimche kuku's and the empty ruka), Pire mawida (snow forest, a konew door), Pukem menoko (frozen wetland, the -ke- stone) and Winkul (the hill, a kütral). Under the empty ruka, the Kolokolo's burrow: three new floors (seasons braziers, stone blocks and plates, season stones, a key, a konew, two minibosses, the -yu- stone) and the den. The past is drawn with its own old-photograph look.

**The opening, played in the present** (`src/kuyworld.js`, `kp_*` maps): the hero starts alone on the sea road; their kuku calls them to the lof, where she has started losing words and sends them to Ngoyman mapu, where the fog is gathering again. Present-day versions of Game 1's places (sea road, lof, the threshold, the stolen coast, the broken gate) lead to the ruined hall where Ti Fütra Ngoymatulfe was fought, drawn grey and cold, with a whirl of stolen words in the middle. It pulls the hero in. In the past they wake in Pire mawida, follow a song to a girl surrounded by two pire wekufü, fight beside her (the first «Iñchiw» battle), and only then learn her name: Liwen. Game 1's places appear only in these present-day scenes.

**The jump into the past** (`src/kuytime.js`): fog rolls in, the voice pulls the letters of the kuku's song away, a whiteout, a fall through rings of light and flying words that turn from the cold blue of now to the warm sepia of the past, then snow. Skippable.

**Pukem extras:** Liwen looks the same on the map as in battle; side quests (the child's snowball game with -yu, the weaver's stolen wool, the lonko's gift); a secret wekufü on the hill after the Kolokolo (Fütra Anchimalleñ).

## Build

    python3 build.py           # player version -> www/index.html
    python3 build.py --master  # testing copy  -> master/index.html

© 2026 Brandon M. A. Rogers. All rights reserved.
