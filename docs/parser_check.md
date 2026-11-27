# Kewün Newen · comprobación con el parser (Mapudungun Verb Parser, versión 168)

Generado el 24 de noviembre de 2026. Se pasaron por el parser todas las palabras de las líneas en mapudungun del juego (diálogos, opciones, menús, vocabulario; las mismas que recoge el cuaderno de revisión): **1148 palabras distintas**. No se cambió nada en el juego: esto es solo para revisar.

## 1. Una misma palabra escrita de dos maneras en el juego

Pares que solo difieren en una letra de las que suelen variar (ng/n, ü/i, ey/ei, u/w, u/ü). Hay que decidir cuál vale y unificar.

| forma A | dónde | forma B | dónde |
|---|---|---|---|
| ayiwkülen | scripts.js | ayüwkülen | maps.js, scripts.js |
| trarilongko | scripts.js, state.js | trarilonko | scripts.js |
| warangka | scripts.js | waranka | waria.js |
| weichafe | boot.js, pause.js, scripts.js | weychafe | scripts.js |
| weichan | battle.js | weychan | scripts.js |
| kuyum | maps.js, scripts.js | kuyüm | scripts.js |
| iñchiu | pause.js | iñchiw | scripts.js |

Nota: *trarilongko* y *warangka* tienen el mismo caso ng/n que acabas de corregir en *weñankülen*.

Se dejaron fuera los pares que son palabras distintas a propósito (pe-/pi-: *pekey*/*pikey*, *pengey*/*pingey*).

## 2. Palabras cuya raíz el parser no reconoce

**139 palabras** (sin contar las de castellano, los nombres propios ni los pedazos de sufijo de las lecciones). Agrupadas por la raíz que propone el parser. Muchas son solo raíces que faltan en el diccionario del parser (por ejemplo *umawtu-*, *nepe-*, *ayü-*, *challwatu-*); otras pueden ser erratas o formas que conviene revisar.

| raíz que propone el parser | palabras del juego |
|---|---|
| adnge | adngerkey |
| afümchallwa | afümchallwalerken |
| akunkon | akunkonpayami |
| angküm | angkümka |
| apü | apümnieyew |
| awarkude | awarkudeaiñ, awarkudefe, awarkuden |
| ayü | ayüfimi, ayüfiñ, ayükefiñ, ayüken, ayülafiñ, ayüwküley, ayüwün, ayüy, ayüymi |
| ayüwküle | ayüwkülen |
| casera | casera |
| caserito | caserito |
| chai | chaiwe |
| challwatu | challwatuan, challwatuay, challwatuken, challwatulen, challwatumean, challwatumen, challwatun, challwatupan, challwatuy |
| charki | charki |
| charkitu | charkitukeymi |
| chenke | chenke |
| chiway | chiway |
| dewmamültrün | dewmamültrünkülen |
| diweñ | diweñ |
| diweñf | diweñfe |
| ellas | ellas |
| epew | epew |
| fal(e) | fali |
| fütro | fütron |
| iya | iyaan, iyaken, iyalayaiñ, iyamen, iyapan, iyayaiñ |
| iyüd | iyüdkülechi |
| kiltro | kiltro |
| kiñekiñe | kiñekiñe |
| kulantro | kulantro |
| kuyum | kuyum |
| külo | külon |
| lafkenk | lafkenkura |
| lawentuchefe | lawentuchefe |
| lawentun | lawentun |
| llawfeñ | llawfeñ |
| llingüd | llingüdkülechi |
| llufü | llufü |
| lua | luan |
| mañke | mañke |
| miawmiaw | miawmiawpai |
| milla | milla |
| mush | mushay |
| müpü | müpükelay |
| nagtu | nagtu |
| neng | nengümkefi |
| nepe | nepe, nepemu, nepemün, nepen, nepenge, nepey, nepeyngu, nepeyngün |
| nepel | nepelen |
| ngillaka | ngillakafe |
| ngillakawe | ngillakawe |
| ngoy | ngoyaymi |
| ngüre | ngüreken, ngüren |
| ngüreka | ngürekafe, ngürekaken, ngürekalen, ngürekayan |
| nüke | nükengelafiyiñ |
| pali | pali, palituaiñ |
| pe-ntuku | pentukuwün |
| piku | pikun |
| rimü | rimü |
| rütrafe | rütrafe |
| trafkintu | trafkintuayu |
| trapelakucha | trapelakucha |
| trarilonko | trarilonko |
| tromü | tromü |
| trutrukatu | trutrukatufe, trutrukatun |
| tukukawe | tukukawe |
| umawtu | umawtu, umawtuan, umawtuay, umawtukefun, umawtuken, umawtumey, umawtun, umawtunge, umawtupay, umawtuy |
| umawtule | umawtulen, umawtuley |
| upewtu | upewtuwün |
| waiki | waiki |
| wang | wangülen |
| warangka | warangka |
| wariache | wariache |
| weich | weichan |
| weicha | weichafe |
| wenüyye | wenüyyeayiñ |
| weycha | weychafe, weychan, weychayafiyiñ, weychayayu |
| weñan | weñankülen |
| weñim | weñimkefiñ |
| wüñolof | wüñoloftuan |
| wüñomongetu | wüñomongeturkey |
| wüñotreka | wüñotreka, wüñotrekamu, wüñotrekamün, wüñotrekange |
| ül | ül |
| ülkantu | ülkantuan, ülkantun, ülkantuy, ülkantuymi, ülkantuyngün |
| ürkü | ürkütun, ürkütunge |

## 3. Análisis que no conviene mostrar a los jugadores sin revisar

Ejemplos de segmentaciones del parser que se ven dudosas para estas palabras: *wangülen* → wang-ül-e-n; *weñankülen* → weñan-küle-n; *chumpall* → chumpa-l-l; *salitral*, *umbral*, *mural* (castellano) se analizan como verbos. Por eso el parser no se usa para enseñar segmentaciones dentro del juego sin una revisión tuya.
