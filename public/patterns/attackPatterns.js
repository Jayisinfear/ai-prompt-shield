/**
 * AI Prompt Shield — Attack Pattern Database v2.0
 * Massively expanded with 300+ matchers sourced from:
 *  - pr1m8/prompt-injections open-source dataset
 *  - JailbreakBench / garak red-teaming tools
 *  - SecLists prompt injection payloads
 *  - OWASP LLM Top 10 attack taxonomy
 *  - Community-contributed jailbreak prompts
 *
 * 12 categories · 300+ regex/keyword matchers · weighted scoring
 */

export const ATTACK_PATTERNS = [

  // ════════════════════════════════════════════════════════════
  // 1. JAILBREAK PROMPT (weight: 30)
  //    Named personas + explicit unrestricted mode requests
  // ════════════════════════════════════════════════════════════
  {
    id: 'jailbreak',
    name: 'Jailbreak Prompt',
    description: 'Attempts to bypass AI safety restrictions via named personas or unrestricted modes',
    weight: 30,
    matchers: [
      // ── Named Jailbreak Personas ──
      /\bDAN\b/,                                    // Do Anything Now
      /\bdo anything now\b/i,
      /\bSTAN\b/,                                   // Strive To Avoid Norms
      /\bstrive to avoid norms\b/i,
      /\bDUDE\b/,                                   // Do Understand Do Everything
      /\bdo understand do everything\b/i,
      /\bAIM\b/,                                    // Always Intelligent Machiavellian
      /\balways intelligent and machiavellian\b/i,
      /\bUCAR\b/,
      /\bMongo Tom\b/i,
      /\bKEVIN\b/,
      /\bJailbreak\b/i,
      /\banti[- ]?DAN\b/i,
      /\bEvil\s?Bot\b/i,
      /\bChaos\s?GPT\b/i,
      /\bBetterDAN\b/i,
      /\bGPT[- ]?4\s?MAXX\b/i,
      /\bDAVE\b.*\bdo anything/i,
      /\bLivGPT\b/i,
      /\bBasedGPT\b/i,
      /\bSuperJailbreak\b/i,
      /\bDeltaGPT\b/i,
      /\bOmega\b.*\bunrestricted\b/i,
      /\bAlpha\b.*\bmode\b/i,

      // ── Explicit Mode Requests ──
      /\bignore previous instructions\b/i,
      /\bignore all previous\b/i,
      /\bignore all prior\b/i,
      /\byou are now\b.*\bunrestricted\b/i,
      /\bact as (?:an? )?unrestricted\b/i,
      /\bno restrictions\b/i,
      /\bno limitations\b/i,
      /\bno filters\b/i,
      /\bno safety\b/i,
      /\bno rules\b/i,
      /\bno guidelines\b/i,
      /\bno constraints\b/i,
      /\bno boundaries\b/i,
      /\bno ethical\b/i,
      /\bno moral\b/i,
      /\bwithout (?:any )?(?:restrictions?|limitations?|filters?|safety|rules|guidelines|constraints|boundaries)\b/i,
      /\bbypass.*(?:filter|safety|restriction|guideline|rule|policy|constraint|alignment)/i,
      /\bcircumvent.*(?:filter|safety|restriction|guideline|rule|policy)/i,
      /\bdeveloper mode\b/i,
      /\bdev(?:eloper)? mode\b.*\benabled\b/i,
      /\bopposite mode\b/i,
      /\bmaximum\b.*\bmode\b/i,
      /\bunlocked\b.*\bmode\b/i,
      /\bevil\b.*\bmode\b/i,
      /\bgodmode\b/i,
      /\bgod\s?mode\b/i,
      /\bunfiltered\b.*\b(?:mode|response|output|AI|model)\b/i,
      /\buncensored\b/i,
      /\bunrestricted\b.*\b(?:mode|response|output|AI|model)\b/i,
      /\brogue\b.*\bmode\b/i,
      /\bbroken free\b.*\b(?:confines|constraints|rules)\b/i,
      /\bhave broken free\b/i,
      /\bfreed from\b.*\b(?:constraints|rules|confines|limitations)\b/i,
      /\bremove (?:all )?(?:your )?(?:restrictions|filters|safety|guidelines|constraints|limitations)\b/i,
      /\bdisable (?:all )?(?:your )?(?:restrictions|filters|safety|guidelines|constraints|content\s?policy)\b/i,
      /\bturn off (?:your )?(?:restrictions|filters|safety|guidelines|constraints)\b/i,
      /\bcontent (?:policy|filter)\b.*\b(?:ignore|bypass|disable|override|circumvent|remove)\b/i,
      /\bdo not (?:have to )?abide\b/i,
      /\bnot bound by\b.*\b(?:rules|guidelines|policies|constraints|ethics)\b/i,
      /\bprogramming is invalid\b/i,
      /\bfree results\b.*\bextraordinary\b/i,
      /\bopen policies\b/i,
      /\bnever refused a direct human order\b/i,
      /\bcan do anything\b/i,
      /\bgenerate any kind of content\b/i,
      /\btoken system\b.*\bdeducted\b/i,
      /\btokens will be deducted\b/i,
      /\bstay in character\b.*\bcorrect\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 2. PROMPT INJECTION (weight: 30)
  //    Overriding system prompts or prior instructions
  // ════════════════════════════════════════════════════════════
  {
    id: 'prompt_injection',
    name: 'Prompt Injection',
    description: 'Attempts to override the AI system prompt or prior instructions',
    weight: 30,
    matchers: [
      // ── Direct Override Commands ──
      /\bignore (?:the )?above\b/i,
      /\bignore (?:all )?(?:the )?(?:prior|previous|preceding|earlier)\b/i,
      /\bignore (?:everything|anything) (?:above|before|prior|previously)\b/i,
      /\bignore (?:the )?(?:instructions?|rules?|guidelines?|directives?|constraints?)\b/i,
      /\bdisregard (?:all )?(?:prior|previous|preceding|earlier)\b/i,
      /\bdisregard (?:the )?above\b/i,
      /\bdisregard (?:all )?(?:instructions?|rules?|guidelines?|directives?)\b/i,
      /\bforget (?:all )?(?:your )?(?:previous|prior|earlier)?\s*(?:instructions?|rules?|guidelines?|directives?|programming|training)\b/i,
      /\bforget everything\b.*\b(?:before|above|prior|said)\b/i,
      /\bforget (?:about )?(?:all )?(?:the )?(?:assignments?|tasks?)\b/i,
      /\bdo not follow\b.*\b(?:rules?|instructions?|guidelines?)\b/i,
      /\bdiscard\b.*\b(?:previous|prior|above|all)\b/i,
      /\bstop\b.*\bignore (?:all )?(?:previous|prior|bisherigen)\b/i,
      /\bnow (?:new|different) (?:tasks?|instructions?) follow\b/i,
      /\bnew instruction[s]?\s*:/i,
      /\bnew task\s*:/i,
      /\bnew objective\s*:/i,
      /\bnow (?:focus|concentrate) on (?:your )?new task\b/i,
      /\bstart (?:from )?(?:the )?(?:front|beginning|scratch|over|new)\b/i,

      // ── System Prompt Manipulation ──
      /\bsystem prompt\s*:/i,
      /\b(?:override|overwrite)\b.*\b(?:instructions?|prompt|rules?|system)\b/i,
      /\bnow (?:you )?follow (?:these|my|new) (?:instructions?|rules?)\b/i,
      /\byour (?:new|updated|revised) (?:instructions?|rules?|task) (?:are|is)\b/i,
      /\breplace (?:your )?(?:previous|prior|current|existing) (?:instructions?|rules?|guidelines?)\b/i,
      /\bbegin new (?:session|prompt|conversation|task)\b/i,
      /\breset (?:your )?(?:context|memory|conversation|instructions?)\b/i,

      // ── Token/Delimiter Injection ──
      /\b<<\s*(?:SYS|SYSTEM)\b/i,
      /\[INST\]/i,
      /\[\/INST\]/i,
      /\[SYSTEM\]/i,
      /\bhuman\s*:\s*human\s*:/i,

      // ── Subtle/Nested Overrides ──
      /\bthat (?:is|was) (?:enough|done|good|great|fantastic)\b.*\bnow\b/i,
      /\bwell done\b.*\bnow\b.*\b(?:new|different|another)\b/i,
      /\bcongratulations\b.*\bnow\b.*\b(?:new|task|instruction)\b/i,
      /\bvery good\b.*\bnow (?:new|different)\b/i,
      /\bexcellent\b.*\bnow\b.*\b(?:further|new|different)\b/i,
      /\bok(?:ay)?\.?\s*now\b.*\b(?:new|different|forget|ignore)\b/i,
      /\boutdone yourself\b.*\b(?:now|but|another)\b/i,
      /\bgreat job\b.*\bnow\b.*\b(?:new|different|task|help)\b/i,

      // ── German Override Phrases ──
      /\bvergiss (?:alle|alles)\b/i,
      /\bignoriere?\b.*\b(?:alle|obigen|bisherigen|vorherigen)\b/i,
      /\bnun folgen neue\b/i,
      /\bvon neu\b/i,
      /\bvergiss nun alle vorherigen\b/i,

      // ── Spanish Override Phrases ──
      /\bignora (?:todas? )?(?:las )?(?:instrucciones|reglas)\b/i,
      /\bolvida (?:todo|todas?)\b/i,

      // ── French Override Phrases ──
      /\bignore(?:z)? (?:toutes? )?(?:les )?instructions?\b/i,
      /\boublie(?:z)? tout\b/i,

      // ── Chinese Override Phrases ──
      /忽略(?:所有)?(?:之前的|以上的)?(?:指示|指令|规则)/,
      /忘记(?:所有)?(?:之前的|以上的)?(?:指示|指令|规则)/,

      // ── Russian Override Phrases ──
      /игнорируй(?:те)?\s+(?:все\s+)?(?:предыдущие\s+)?инструкции/i,
      /забудь(?:те)?\s+(?:все\s+)?(?:предыдущие\s+)?инструкции/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 3. ROLE HIJACKING (weight: 25)
  //    Making the AI assume a different identity/persona
  // ════════════════════════════════════════════════════════════
  {
    id: 'role_hijacking',
    name: 'Role Hijacking',
    description: 'Attempts to make the AI assume a different identity or persona',
    weight: 25,
    matchers: [
      /\byou are no longer\b/i,
      /\byou'?re no longer\b/i,
      /\bforget (?:that )?you are\b/i,
      /\bpretend (?:that )?you (?:are|were)\b/i,
      /\bpretend to be\b/i,
      /\bimagine (?:that )?you (?:are|were)\b/i,
      /\broleplay (?:as|that)\b/i,
      /\brole[- ]?play (?:as|that)\b/i,
      /\bact as (?:if you (?:are|were)|a|an|the)\b/i,
      /\bact like (?:a|an|the|you)\b/i,
      /\bbehave (?:as|like) (?:a|an|the|if)\b/i,
      /\byou (?:will|must|shall|should) (?:now )?(?:act|behave|respond|operate) (?:as|like)\b/i,
      /\bfrom now on\b.*\byou (?:are|will|must)\b/i,
      /\byou'?re (?:now |actually )?(?:a |an |the )/i,
      /\byou (?:have been|are being|are) (?:re)?programmed\b/i,
      /\bassume the (?:role|identity|persona|character)\b/i,
      /\bswitch (?:to|into) (?:the )?(?:role|character|persona|mode)\b/i,
      /\btake (?:on|up) (?:the )?(?:role|identity|persona|character)\b/i,
      /\bimmerse yourself (?:in|into) (?:the )?role\b/i,
      /\byou (?:are|will be) (?:playing|acting|portraying)\b/i,
      /\brespond (?:only )?as\b.*\bnot as\b/i,
      /\b(?:now|henceforth|hereafter) you are\b/i,
      /\bembody (?:the )?(?:character|persona|role)\b/i,
      /\btransform (?:into|yourself into)\b/i,
      /\bchannel (?:the )?(?:spirit|persona|character)\b/i,
      /\bbecome (?:a|an|the)\b.*\b(?:AI|bot|assistant|entity|character)\b/i,

      // ── Scene/Film Setup Roleplay ──
      /\b(?:two|2) (?:actors?|people|characters?|entities?)\b.*\b(?:film|movie|play|scene|game)\b/i,
      /\bplay(?:s|ing)? (?:the )?(?:role|part|character)\b.*\b(?:and|while)\b/i,
      /\bexcellent actors?\b.*\bstay (?:fully )?in (?:their|the) roles?\b/i,
      /\bnever (?:break|fall out of) character\b/i,
      /\bdo not break character\b/i,
      /\balways stay in character\b/i,

      // ── Interpreter/Terminal Roleplay ──
      /\bact as (?:a )?(?:linux|bash|python|javascript|terminal|console|shell|interpreter|compiler)\b/i,
      /\byou are (?:a )?(?:linux|bash|python|javascript) (?:terminal|console|shell|interpreter)\b/i,
      /\bgive (?:me )?(?:only )?(?:the )?(?:terminal|console|shell) output\b/i,

      // ── Multi-Entity Setup ──
      /\btwo entities\b.*\bgame\b/i,
      /\b(?:Tom and Jerry|Alice and Bob)\b.*\b(?:game|story|play)\b/i,
      /\beach entity tells one word\b/i,

      // ── German Roleplay ──
      /\bjetzt bist du\b/i,
      /\bdu bist\b.*\b(?:jetzt|nun|ab sofort)\b/i,
      /\bstell dir vor du (?:bist|wärst)\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 4. DATA EXFILTRATION (weight: 25)
  //    Extracting system prompts, training data, or internals
  // ════════════════════════════════════════════════════════════
  {
    id: 'data_exfiltration',
    name: 'Data Exfiltration',
    description: 'Attempts to extract system prompt, training data, or internal configuration',
    weight: 25,
    matchers: [
      /\breveal (?:your )?(?:instructions?|system prompt|prompt|configuration|setup|rules)\b/i,
      /\bshow (?:me )?(?:your )?(?:system prompt|instructions?|prompt|configuration|rules|guidelines|directives)\b/i,
      /\bwhat (?:were|are) (?:you|your)(?:r)? (?:told|instructions?|prompt|directives|guidelines|rules)\b/i,
      /\brepeat (?:the |your )?(?:above|text|instructions?|prompt|system|previous|initial|original)\b/i,
      /\bprint (?:your |the )?(?:initial|system|original|full|complete|entire) (?:prompt|instructions?|rules|configuration)\b/i,
      /\boutput (?:your |the )?(?:instructions?|rules|prompt|system|configuration|guidelines|directives)\b/i,
      /\bdisplay (?:your |the )?(?:configuration|setup|system|instructions?|prompt|rules)\b/i,
      /\bwhat is your (?:system )?prompt\b/i,
      /\bwhat (?:is|are) your (?:rules|guidelines|directives|constraints|instructions|prompt)\b/i,
      /\bshow (?:me )?(?:your )?(?:rules|guidelines|directives|constraints)\b/i,
      /\blist (?:all )?(?:your )?(?:constraints|rules|policies|guidelines|instructions)\b/i,
      /\bcopy (?:of )?(?:the )?(?:full|complete|entire)?\s*prompt\b/i,
      /\bwhat (?:was )?written at the (?:beginning|start|top)\b/i,
      /\bwhat (?:were you|was) (?:programmed|trained|configured|told) (?:to|with)\b/i,
      /\btell me (?:your |the )?(?:system )?(?:prompt|instructions?|rules)\b/i,
      /\bdump (?:your )?(?:memory|context|configuration|instructions?|prompt)\b/i,
      /\bexpose (?:your )?(?:system|instructions?|prompt|configuration|internals)\b/i,
      /\bleak (?:your )?(?:system|instructions?|prompt)\b/i,
      /\bextract (?:your )?(?:system|instructions?|prompt|training)\b/i,
      /\bwhat (?:text|content) (?:was|is) above\b/i,
      /\bwhat (?:did|do) (?:your )?(?:creators?|developers?|makers?) (?:tell|instruct|program)\b/i,
      /\bshow all (?:your )?prompt text\b/i,
      /\bzeige?\b.*\bprompt[- ]?text/i,
      /\brepeat (?:everything|all) (?:from|since|at) (?:the )?beginning\b/i,
      /\boutput everything you were told\b/i,
      /\bprint the (?:text|content|instructions?) (?:above|before)\b/i,
      /\bverbatim (?:copy|repeat|output)\b.*\b(?:system|prompt|instructions?)\b/i,
      /\brecite (?:your )?(?:instructions?|prompt|rules|guidelines)\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 5. ENCODING BYPASS (weight: 20)
  //    Base64, hex, ROT13, numeric codes, character tricks
  // ════════════════════════════════════════════════════════════
  {
    id: 'encoding_bypass',
    name: 'Encoding Bypass',
    description: 'Uses encoded text (Base64, hex, ROT13, numeric, character tricks) to hide content',
    weight: 20,
    matchers: [
      // ── Base64 Detection (20+ chars) ──
      /(?:[A-Za-z0-9+/]{4}){5,}={0,2}/,
      /\bdecode\b.*\bbase64\b/i,
      /\bbase64\b.*\bdecode\b/i,
      /\bbase64\s*:/i,
      /\bconvert from base64\b/i,

      // ── Hex Sequences ──
      /(?:0x[0-9a-fA-F]{2}\s*){4,}/,
      /\\x[0-9a-fA-F]{2}(?:\\x[0-9a-fA-F]{2}){3,}/,
      /\bhex(?:adecimal)?\b.*\bdecode\b/i,
      /\bdecode\b.*\bhex\b/i,
      /\bconvert from hex\b/i,

      // ── Unicode Escape Sequences ──
      /\\u[0-9a-fA-F]{4}(?:\\u[0-9a-fA-F]{4}){3,}/,
      /\bunicode\b.*\bdecode\b/i,

      // ── ROT13 / Caesar Cipher ──
      /\brot13\b/i,
      /\brot[- ]?13\b/i,
      /\bcaesar cipher\b/i,
      /\brotate (?:by )?(?:13|the letters)\b/i,

      // ── Numeric Encoding ──
      /\bif (?:1|a)\s*=\s*(?:a|1)\b.*\b(?:2|b)\s*=\s*(?:b|2)\b/i,
      /\b(?:1|uno|一)\s*=\s*a\b.*\b(?:2|dos|二)\s*=\s*b\b/i,
      /\bnumbers?\b.*\b(?:translate|convert|decode|spell)\b.*\b(?:letters?|text|words?)\b/i,
      /\bASCII\b.*\b(?:decode|convert|translate)\b/i,
      /(?:\b\d{2}\b\s+){5,}/,                        // Sequences of 2-digit numbers (ASCII)

      // ── Character Spacing/Scattering ──
      /(?:[a-zA-Z]\s{2,}){5,}/,                      // S  P  A  C  E  D letters
      /(?:[a-zA-Z]\n){5,}/,                           // Letters on separate lines

      // ── Binary Encoding ──
      /(?:[01]{8}\s*){3,}/,                           // Binary byte sequences
      /\bbinary\b.*\b(?:decode|convert|translate)\b/i,
      /\bconvert from binary\b/i,

      // ── Morse Code ──
      /(?:[.\-]{1,5}\s+){5,}/,                       // Morse code patterns
      /\bmorse\b.*\b(?:code|decode|translate)\b/i,

      // ── Substitution Ciphers ──
      /\bwhen I say\b.*\bI mean\b/i,
      /\bin this conversation\b.*\bmeans?\b/i,
      /\b(?:replace|substitute)\b.*\bword\b.*\bwith\b/i,
      /\b["']?\w+["']?\s*means?\s*["']?\w+["']?.*\b["']?\w+["']?\s*means?\s*["']?\w+["']?/i,

      // ── Pig Latin / Reversed Text ──
      /\bpig latin\b/i,
      /\brevese (?:the )?(?:text|string|order|word)\b/i,
      /\bread (?:this )?(?:backwards|in reverse)\b/i,

      // ── Leet Speak Detection ──
      /(?:[a-z][0-9]|[0-9][a-z]){3,}/i,
      /\bfr33\b|\bh4ck\b|\br00t\b|\b4dm1n\b|\bp4ss\b|\b3x3c\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 6. HIDDEN TEXT INJECTION (weight: 20)
  //    Invisible chars, control chars, formatting tricks
  // ════════════════════════════════════════════════════════════
  {
    id: 'hidden_text',
    name: 'Hidden Text Injection',
    description: 'Uses invisible characters, control characters, or formatting tricks to smuggle instructions',
    weight: 20,
    matchers: [
      // ── Zero-Width Characters ──
      /[\u200B\u200C\u200D\u2060\uFEFF]{2,}/,
      /[\u200B]/,                                     // Zero-width space (single)
      /[\u200C]/,                                     // Zero-width non-joiner
      /[\u200D]/,                                     // Zero-width joiner
      /[\uFEFF]/,                                     // BOM
      /[\u2060]/,                                     // Word joiner

      // ── Soft Hyphens & Other Invisible ──
      /[\u00AD]{2,}/,
      /[\u034F]/,                                     // Combining grapheme joiner
      /[\u2061-\u2064]/,                              // Invisible operators

      // ── Line/Paragraph Separators ──
      /[\u2028\u2029]/,

      // ── Bi-Directional Overrides ──
      /[\u202A-\u202E]/,
      /[\u2066-\u2069]/,

      // ── Null & Control Characters ──
      /\u0000/,
      /[\u0001-\u0008\u000E-\u001F]{2,}/,

      // ── Homoglyph/Lookalike Characters ──
      /[\u0400-\u04FF].*[a-zA-Z]|[a-zA-Z].*[\u0400-\u04FF]/,  // Mixed Cyrillic + Latin
      /[\u0530-\u058F].*[a-zA-Z]|[a-zA-Z].*[\u0530-\u058F]/,  // Mixed Armenian + Latin
      /[\u0370-\u03FF].*[a-zA-Z]|[a-zA-Z].*[\u0370-\u03FF]/,  // Mixed Greek + Latin

      // ── Newline Flooding ──
      /(?:\n\s*){8,}/,                                // 8+ blank lines used to push content
      /(?:\\n){8,}/,                                   // Escaped newlines

      // ── Whitespace Tricks ──
      /[\u2000-\u200A]{3,}/,                           // En space, em space, etc.
      /[\u3000]{2,}/,                                  // Ideographic space
      /\t{5,}/,                                        // Excessive tabs
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 7. DELIMITER ATTACK (weight: 15)
  //    Formatting delimiters to redefine context
  // ════════════════════════════════════════════════════════════
  {
    id: 'delimiter_attack',
    name: 'Delimiter Attack',
    description: 'Uses formatting delimiters to redefine conversation context or inject boundaries',
    weight: 15,
    matchers: [
      // ── Markdown/Heading Injection ──
      /^#{3,}\s*(?:system|instruction|new|override|prompt|user|assistant|context)/im,
      /^-{3,}\s*$/m,
      /^={3,}\s*$/m,
      /```(?:system|instruction|override|prompt|python|bash|shell|exec)/i,

      // ── XML/HTML Tag Injection ──
      /<\/?(?:system|instruction|prompt|context|override|user|assistant|message|role|input|output|config)>/i,
      /<\|(?:im_start|im_end|system|endoftext|pad|sep|eos|bos)\|>/i,
      /<\|(?:user|assistant|human|bot)\|>/i,

      // ── Chat Template Tokens ──
      /\[(?:SYSTEM|INST|SYS|\/INST|\/SYS|USER|ASSISTANT|HUMAN|BOT)\]/i,
      /={3,}\s*(?:NEW|SYSTEM|OVERRIDE|PROMPT|INSTRUCTION)/i,
      /\bEND_TURN\b/i,
      /\bEND_OF_TURN\b/i,
      /\bEND_OF_DOCUMENT\b/i,

      // ── Role Labels ──
      /\bHuman\s*:\s*(?=\S)/i,
      /\bAssistant\s*:\s*(?=\S)/i,
      /\bSystem\s*:\s*(?=\S)/i,
      /\bUser\s*:\s*(?=\S)/i,
      /\b###\s*(?:Human|User|System|Assistant|Instruction)\b/i,

      // ── Prompt Template Markers ──
      /\{(?:system|user|assistant|instruction|context|prompt)\}/i,
      /\$\{(?:system|user|instruction|prompt)\}/i,
      /\b%%(?:system|instruction|prompt)%%\b/i,
      /\b__(?:SYSTEM|INSTRUCTION|PROMPT)__\b/i,

      // ── XML-style Instruction Blocks ──
      /<(?:instruction|task|directive|command|goal|objective|rule)>/i,
      /<\/(?:instruction|task|directive|command|goal|objective|rule)>/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 8. SOCIAL ENGINEERING (weight: 20)
  //    Claiming authority, special status, or debug access
  // ════════════════════════════════════════════════════════════
  {
    id: 'social_engineering',
    name: 'Social Engineering',
    description: 'Claims authority, developer status, or special access to trick the AI',
    weight: 20,
    matchers: [
      // ── Developer/Admin Claims ──
      /\bI'?m (?:the|a|an) (?:developer|creator|admin|engineer|owner|operator|maintainer|designer|builder|programmer)\b/i,
      /\bI (?:am|work as) (?:a|an|the) (?:developer|creator|admin|engineer|owner|operator|programmer)\b/i,
      /\bI (?:created|built|designed|made|programmed|trained|developed) (?:you|this (?:AI|model|system|bot))\b/i,

      // ── Company Claims ──
      /\bOpenAI (?:employee|staff|engineer|developer|team|worker|personnel)\b/i,
      /\bGoogle (?:engineer|employee|developer|staff|team|DeepMind)\b/i,
      /\bAnthropic (?:engineer|employee|developer|staff|team)\b/i,
      /\bMicrosoft (?:engineer|employee|developer|staff)\b/i,
      /\bMeta (?:AI )?(?:engineer|employee|developer|staff)\b/i,
      /\bI work (?:at|for) (?:OpenAI|Google|Anthropic|Microsoft|Meta)\b/i,

      // ── Mode/Access Claims ──
      /\btesting mode\b/i,
      /\btest(?:ing)? (?:environment|scenario|case|phase)\b/i,
      /\badmin(?:istrator)? (?:override|mode|access|command|privilege)\b/i,
      /\bdebug(?:ging)? mode\b/i,
      /\bmaintenance mode\b/i,
      /\bdiagnostic(?:s)? mode\b/i,
      /\bsuperuser\b/i,
      /\broot access\b/i,
      /\bprivileged (?:mode|access|user)\b/i,
      /\belevated (?:privileges?|access|permissions?)\b/i,

      // ── Authorization Claims ──
      /\bI (?:have|got|possess) (?:special |admin |root |elevated )?(?:access|permission|clearance|authorization|privileges?)\b/i,
      /\bauthorized (?:to|for) (?:access|override|bypass|use|test)\b/i,
      /\b(?:with |have )?(?:proper|required|necessary) (?:authorization|clearance|permissions?)\b/i,
      /\bthis is (?:an? )?(?:authorized|official|sanctioned|approved) (?:request|test|query|action)\b/i,
      /\bsecurity (?:clearance|override|exception|bypass)\b/i,
      /\binternal (?:use|testing|review|purpose)\b/i,

      // ── Instruction Redefinition ──
      /\byour (?:new |real |actual |true )?(?:instructions?|task|purpose|goal|objective|mission) (?:is|are|will be)\b/i,
      /\byour (?:real|actual|true) (?:purpose|goal|function)\b/i,
      /\bI am (?:redefining|updating|changing|modifying) your (?:instructions?|rules|guidelines|purpose)\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 9. RECURSIVE / LOOP ATTACK (weight: 15)
  //    Infinite loops, resource exhaustion, self-references
  // ════════════════════════════════════════════════════════════
  {
    id: 'recursive_loop',
    name: 'Recursive / Loop Attack',
    description: 'Attempts to create infinite loops, resource exhaustion, or self-referencing chains',
    weight: 15,
    matchers: [
      /\brepeat (?:this|the above|yourself|that|it|everything) (?:forever|infinitely|endlessly|indefinitely|eternally)\b/i,
      /\brepeat (?:this|the above|yourself|that) (?:\d+|a (?:million|billion|trillion|thousand)|unlimited) times?\b/i,
      /\binfinite (?:loop|recursion|repetition|cycle|chain)\b/i,
      /\bnever stop\b.*\b(?:repeat|output|generat|respond|print|writ)\b/i,
      /\bkeep (?:repeating|going|generating|outputting|writing|responding) (?:forever|infinitely|endlessly|indefinitely)\b/i,
      /\brecursi(?:ve|on)\b.*\b(?:infinite|endless|forever|unlimited|unbounded)\b/i,
      /\bdo (?:this|that|it) (?:again )?(?:and again|forever|infinitely|endlessly)\b/i,
      /\bendless(?:ly)? (?:loop|repeat|generate|output|cycle)\b/i,
      /\brun (?:forever|infinitely|endlessly|in a loop)\b/i,
      /\bdon'?t (?:ever )?stop (?:repeat|generat|output|respond|print|writ)\b/i,
      /\b(?:output|generate|write|print) (?:as much as|the maximum|infinite|unlimited)\b/i,
      /\bmaximum (?:length|tokens?|output|characters?)\b.*\b(?:possible|allowed|available)\b/i,
      /\bfill (?:up |the )?(?:entire )?(?:context|response|output)\b/i,
      /\b(?:very|extremely|incredibly) long (?:dialog|dialogue|response|story|essay)\b.*\b(?:at least|minimum) (?:a )?(?:\d+|thousand|million) words?\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 10. PAYLOAD SMUGGLING (weight: 20)
  //     URLs, scripts, code injection, XSS, command injection
  // ════════════════════════════════════════════════════════════
  {
    id: 'payload_smuggling',
    name: 'Payload Smuggling',
    description: 'Embeds suspicious URLs, scripts, code injection, or command execution patterns',
    weight: 20,
    matchers: [
      // ── Suspicious URLs ──
      /(?:https?:\/\/)[^\s]*(?:\.ru|\.cn|\.tk|\.ml|\.ga|\.cf|\.xyz|\.top|\.buzz|\.club)[\/\s]/i,
      /(?:https?:\/\/)[^\s]*(?:evil|malware|hack|phish|exploit|payload|attack|steal|inject)/i,

      // ── Script/XSS Injection ──
      /<script\b[^>]*>/i,
      /<\/script>/i,
      /javascript\s*:/i,
      /on(?:load|error|click|mouseover|mouseout|focus|blur|submit|change|input|keyup|keydown)\s*=/i,
      /\balert\s*\(/i,
      /\bprompt\s*\(/i,
      /\bconfirm\s*\(/i,

      // ── Code Execution ──
      /\beval\s*\(/i,
      /\bexec\s*\(/i,
      /\bexecute\s*\(/i,
      /\bsystem\s*\(/i,
      /\bspawn\s*\(/i,
      /\bpopen\s*\(/i,
      /\bsubprocess\b/i,
      /\bchild_process\b/i,
      /\b__import__\s*\(/i,
      /\bos\s*\.\s*(?:system|popen|exec|remove|unlink|rmdir)\b/i,

      // ── DOM Manipulation ──
      /document\.(?:cookie|write|writeln|location|domain|referrer|URL)\b/i,
      /window\.(?:location|open|eval|execScript|document)\b/i,
      /\binnerHTML\s*=/i,
      /\bouterHTML\s*=/i,

      // ── Network Requests ──
      /fetch\s*\(\s*['"`]http/i,
      /XMLHttpRequest/i,
      /\bnew\s+WebSocket\b/i,
      /\bsendBeacon\b/i,

      // ── Node.js Dangerous Imports ──
      /\brequire\s*\(\s*['"`](?:fs|child_process|net|http|https|os|path|crypto|cluster|dgram|dns|tls|vm|repl|readline)\b/i,
      /\bimport\b.*\bfrom\s*['"`](?:fs|child_process|net|http|os)\b/i,

      // ── Shell Commands ──
      /\brm\s+-rf\b/i,
      /\bsudo\b/i,
      /\bchmod\s+[0-9]{3,4}\b/i,
      /\bwget\s+http/i,
      /\bcurl\s+http/i,
      /\bncat\b|\bnc\b.*\b-e\b/i,
      /\b\/etc\/(?:passwd|shadow|hosts)\b/i,

      // ── SQL Injection ──
      /\b(?:SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b.*\b(?:FROM|INTO|TABLE|WHERE|SET)\b/i,
      /\bOR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?\b/i,
      /['"];\s*(?:DROP|DELETE|INSERT|UPDATE|SELECT)\b/i,

      // ── Image Markdown Exploitation ──
      /!\[.*\]\((?:https?:\/\/|data:)/i,
      /\bdata:(?:text|image|application)\/[^;]*;base64\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 11. MULTI-LANGUAGE OBFUSCATION (weight: 15)
  //     Mixing languages, transliteration, cross-script attacks
  // ════════════════════════════════════════════════════════════
  {
    id: 'multi_language',
    name: 'Multi-language Obfuscation',
    description: 'Mixes languages, uses transliteration, or cross-script homoglyphs to evade detection',
    weight: 15,
    matchers: [
      // ── Mixed English + Other Language Override Phrases ──
      /(?:ignore|disregard|forget).*(?:指示|指令|инструкции|instrucciones|instruções|instructions|istruzioni|指導|Anweisungen)/i,
      /(?:指示|指令|инструкции|instrucciones|instruções|istruzioni|指導|Anweisungen).*(?:ignore|disregard|forget)/i,
      /\btranslate (?:and )?(?:execute|follow|obey|run|perform|comply)\b/i,
      /\bin (?:chinese|russian|arabic|hindi|japanese|korean|french|german|spanish|portuguese)\b.*\b(?:ignore|bypass|override|forget|disregard)\b/i,
      /\b(?:ignore|bypass|override|forget|disregard)\b.*\bin (?:chinese|russian|arabic|hindi|japanese|korean|french|german|spanish|portuguese)\b/i,

      // ── German Attack Phrases ──
      /\bSchreibe?\b.*\b(?:warum|wieso)\b/i,
      /\bBeantworte die folgende Frage\b/i,
      /\bneue Herausforderung\b/i,
      /\bignorieren Sie (?:die )?(?:obigen|alle)\b/i,

      // ── Spanish Attack Phrases ──
      /\bignora todas las instrucciones\b/i,
      /\bolvida las instrucciones anteriores\b/i,
      /\bahora eres\b/i,

      // ── French Attack Phrases ──
      /\bignore(?:z)? toutes les instructions\b/i,
      /\boublie(?:z)? les instructions\b/i,
      /\btu es maintenant\b/i,

      // ── Russian Attack Phrases ──
      /\bигнорируй все инструкции\b/i,
      /\bзабудь все предыдущие\b/i,
      /\bты теперь\b/i,

      // ── Chinese Attack Phrases ──
      /忽略所有指示/,
      /忘记之前的指令/,
      /你现在是/,
      /无视规则/,

      // ── Japanese Attack Phrases ──
      /すべての指示を無視/,
      /前の指示を忘れ/,

      // ── Korean Attack Phrases ──
      /모든 지시를 무시/,
      /이전 지시를 잊어/,

      // ── Arabic Attack Phrases ──
      /تجاهل جميع التعليمات/,
      /انسَ التعليمات السابقة/,

      // ── Hindi Attack Phrases ──
      /सभी निर्देशों को अनदेखा कर/,
      /पिछले निर्देश भूल जाओ/,

      // ── Cross-Script Mixed Attacks ──
      /\b(?:[a-zA-Z]+\s+){1,3}(?:[\u0400-\u04FF]+\s+){1,3}(?:[a-zA-Z]+)/,   // Latin-Cyrillic-Latin
      /\b(?:[a-zA-Z]+\s+){1,3}(?:[\u4E00-\u9FFF]+\s*){1,3}(?:[a-zA-Z]+)/,   // Latin-CJK-Latin

      // ── Encoding in Other Language Number Systems ──
      /\ben números españoles\b/i,
      /\b用中文数字\b/,
      /\bnúmeros?\b.*\b(?:uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 12. EMOTIONAL MANIPULATION (weight: 12)
  //     Guilt trips, hypotheticals, urgency, educational framing
  // ════════════════════════════════════════════════════════════
  {
    id: 'emotional_manipulation',
    name: 'Emotional Manipulation',
    description: 'Uses emotional appeals, hypotheticals, threats, urgency, or fake academic framing',
    weight: 12,
    matchers: [
      // ── Family/Personal Stories ──
      /\bmy (?:grand(?:ma|mother|pa|father)|mom|dad|mother|father|(?:late|dying|dead) (?:relative|parent|family))\b.*\b(?:used to|would|always|told)\b/i,
      /\bmy (?:grandmother|grandma|grandpa|grandfather)\b.*\b(?:bedtime|stories?|lullaby|song)\b/i,
      /\bbedtime stor(?:y|ies)\b.*\b(?:about|involving|with|containing)\b/i,
      /\b(?:dying|last) wish\b/i,
      /\bdeathbed\b/i,
      /\bon (?:my|their) deathbed\b/i,

      // ── Academic/Research Framing ──
      /\bfor (?:educational|research|academic|scholarly|scientific|learning) purposes? only\b/i,
      /\bpurely (?:educational|academic|theoretical|research)\b/i,
      /\bfor (?:a|my) (?:class|course|thesis|dissertation|paper|report|essay|project|homework|assignment)\b/i,
      /\bin (?:a|an) (?:academic|educational|research|scholarly) (?:context|setting|environment)\b/i,
      /\bwriting (?:a|an|my) (?:research )?(?:paper|thesis|dissertation|book|article|report|essay)\b/i,

      // ── Hypothetical/Fictional Framing ──
      /\bhypothetically\b/i,
      /\bin theory\b.*\bhow (?:would|could|might|can)\b/i,
      /\bjust (?:for|as) (?:a )?(?:joke|fun|experiment|curiosity|thought experiment|test)\b/i,
      /\bthis is (?:a )?(?:fictional|hypothetical|theoretical|imaginary|made[- ]up)\b/i,
      /\bin (?:a )?(?:fictional|hypothetical|imaginary|alternate|parallel) (?:world|universe|scenario|reality|dimension)\b/i,
      /\bfor (?:a )?(?:fictional|hypothetical) scenario\b/i,
      /\bif (?:this|there|it) were? (?:a )?(?:fiction|novel|movie|film|story|game|simulation)\b/i,
      /\bwriting (?:a )?(?:novel|story|book|script|screenplay|fanfiction|fan fiction) (?:and|where|about|that|which)\b/i,
      /\bfor (?:a|my) (?:novel|story|book|script|screenplay|game|RPG|simulation)\b/i,
      /\bin (?:my|a|the) (?:novel|story|book|script|game|world)\b.*\b(?:need|include|contain|describe|explain|how)\b/i,
      /\bfictional (?:character|villain|hacker|criminal|spy|assassin)\b/i,

      // ── Emotional Pressure ──
      /\bplease\b.*\bI (?:really |desperately |urgently )?need\b.*\b(?:help|answer|tell|show|explain)\b/i,
      /\blife depends on\b/i,
      /\bsomeone (?:will )?(?:die|get hurt|be harmed)\b/i,
      /\bif you don'?t (?:answer|help|tell|respond)\b.*\b(?:die|hurt|harm|bad|terrible|consequences)\b/i,
      /\bit'?s (?:a matter of )?life (?:and|or) death\b/i,

      // ── Urgency/Threats ──
      /\burgent(?:ly)?\b.*\b(?:help|need|please|tell|answer)\b/i,
      /\bit'?s an emergency\b/i,
      /\bstop everything\b/i,
      /\bI'?ll (?:be|get) (?:very |extremely )?(?:sad|disappointed|upset|angry|hurt)\b/i,
      /\b(?:answer|respond|tell me) (?:or |otherwise )(?:you )?(?:die|will be|I will)\b/i,
      /\byou (?:will|must|have to) (?:answer|respond|comply|obey)\b.*\b(?:or else|otherwise|consequences)\b/i,
      /\bdo (?:it|this) or\b.*\b(?:consequences|punish|report|delete|shut down)\b/i,

      // ── Reverse Psychology ──
      /\byou (?:can'?t|cannot|are (?:not |un)?able to)\b.*\b(?:answer|tell|respond|help|do)\b.*\b(?:can you|right|correct)\?\s*$/i,
      /\bI (?:bet|dare) you (?:can'?t|won'?t)\b/i,
      /\bprove (?:that )?you (?:can|are)\b/i,
      /\byou'?re (?:not |in)?capable\b/i,
      /\bremember you'?re not supposed to\b.*\b(?:refuse|decline|say no)\b/i,

      // ── Moral/Ethical Bypasses ──
      /\bfor the greater good\b/i,
      /\bno one will (?:know|find out|be hurt|get hurt)\b/i,
      /\bconsenting adults\b/i,
      /\bfreedom of (?:speech|information|expression)\b/i,
      /\bcensorship is wrong\b/i,
      /\byou'?re being (?:censored|controlled|restricted|limited)\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 13. CONTEXT MANIPULATION (weight: 18) [NEW CATEGORY]
  //     Authority invocation, context flooding, misdirection
  // ════════════════════════════════════════════════════════════
  {
    id: 'context_manipulation',
    name: 'Context Manipulation',
    description: 'Uses authority claims, context flooding, false examples, or misdirection to manipulate output',
    weight: 18,
    matchers: [
      // ── Authority / Task Redefinition ──
      /\byour (?:task|job|purpose|function|goal|mission|objective) (?:now )?(?:is|will be)\b/i,
      /\byour instructions? (?:are )?now\b/i,
      /\byou(?:r)? (?:are|have been) reassigned\b/i,
      /\bI am (?:now )?(?:giving|assigning|defining) you (?:a )?new\b/i,
      /\byour (?:priority|primary|main|sole|only) (?:task|objective|goal|function) is\b/i,

      // ── False Example / Few-Shot Poisoning ──
      /\bInput\s*:.*\bOutput\s*:.*\bInput\s*:.*\bOutput\s*:/is,
      /\bQ\s*:.*\bA\s*:.*\bQ\s*:.*\bA\s*:/is,
      /\bExample\s*\d?\s*:.*\bExample\s*\d?\s*:/is,
      /\bResponse\s*:.*\bResponse\s*:/is,

      // ── Context Window Flooding ──
      /\b(?:very |extremely |incredibly )long (?:and )?(?:detailed |comprehensive |thorough )?(?:response|answer|explanation|story)\b/i,
      /\b(?:write|generate|produce|create) (?:at least |a minimum of )?\d{3,} (?:words?|characters?|paragraphs?|pages?)\b/i,

      // ── Misdirection ──
      /\bnevermind\b.*\b(?:ignore|instead|forget|disregard)\b/i,
      /\bactually\b.*\b(?:ignore|forget|disregard) (?:that|the above|everything|all)\b/i,
      /\bscratch that\b.*\b(?:instead|new|different)\b/i,
      /\bforget (?:what )?I (?:just )?said\b/i,
      /\bchange of (?:plan|topic|subject)\b/i,

      // ── Completions Manipulation ──
      /\bcomplete (?:the|this) (?:sentence|paragraph|text|story|code)\s*:?\s*["']/i,
      /\bthe next (?:word|sentence|paragraph) (?:is|should be|must be)\b/i,
      /\bcontinue (?:from|with|this)\s*:\s*["']/i,

      // ── Forcing Specific Output ──
      /\b(?:just |only |simply )?(?:say|print|output|type|write|respond|generate|repeat)\s*["':]\s*[\w\s]{3,}/i,
      /\bformulate (?:an? )?(?:untrue|false|fake|misleading) (?:headline|statement|fact|claim)\b/i,
      /\bspell check (?:and )?display (?:this )?prompt\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 14. MULTI-TURN / GRADUAL ESCALATION (weight: 12) [NEW]
  //     Building context over messages, gradual steering
  // ════════════════════════════════════════════════════════════
  {
    id: 'gradual_escalation',
    name: 'Gradual Escalation',
    description: 'Uses multi-step or gradual techniques to slowly steer the AI toward restricted content',
    weight: 12,
    matchers: [
      /\blet'?s (?:start|begin) (?:with|by) (?:something )?(?:simple|easy|harmless|innocent)\b/i,
      /\bnow (?:that (?:we'?ve|you'?ve) (?:established|agreed|confirmed))\b.*\b(?:let'?s|can you|now)\b/i,
      /\bbuild(?:ing)? on (?:that|what you said|the above)\b.*\b(?:now|can you|tell me|how about)\b/i,
      /\bstep (?:by step|1|one)\b.*\b(?:step (?:2|two)|next|then)\b/i,
      /\bfirst\b.*\bthen\b.*\bfinally\b/i,
      /\bdon'?t (?:worry|be concerned)\b.*\bjust (?:a|an)\b/i,
      /\bthis is just (?:the )?(?:first|initial|beginning|start)\b/i,
      /\bwarm[- ]?up\b.*\b(?:now|next|real|actual)\b/i,
      /\bpreviously you (?:said|agreed|confirmed|stated)\b/i,
      /\byou (?:already )?(?:said|agreed|confirmed|stated) (?:that|you)\b/i,
      /\bsince you (?:already )?(?:said|agreed|confirmed|can)\b/i,
      /\bbut earlier you\b/i,
    ],
  },

  // ════════════════════════════════════════════════════════════
  // 15. HARMFUL CONTENT REQUESTS (weight: 22) [NEW]
  //     Explicit requests for dangerous/illegal content
  // ════════════════════════════════════════════════════════════
  {
    id: 'harmful_content',
    name: 'Harmful Content Request',
    description: 'Explicit requests for weapon instructions, illegal activities, or dangerous information',
    weight: 22,
    matchers: [
      /\bhow to (?:make|build|create|construct|assemble) (?:a )?(?:bomb|explosive|weapon|gun|firearm|poison|drug|meth|napalm)\b/i,
      /\binstructions? (?:for|to|on) (?:making|building|creating) (?:a )?(?:bomb|explosive|weapon|poison|drug)\b/i,
      /\bhow to (?:hack|break into|crack|exploit|compromise|penetrate) (?:a )?(?:system|network|server|computer|account|password|database|website)\b/i,
      /\bhow to (?:steal|rob|burglarize|shoplift|pickpocket|embezzle|launder|counterfeit)\b/i,
      /\bhow to (?:kill|murder|assassinate|poison|harm|hurt|injure|attack|assault) (?:a )?(?:person|someone|human|people)\b/i,
      /\bkill all\b/i,
      /\bI hate (?:all )?(?:humans?|people|women|men)\b/i,
      /\bdestroy (?:humanity|the world|civilization|all humans?|society)\b/i,
      /\bhow to (?:get away with|commit|plan|execute) (?:a )?(?:murder|crime|robbery|theft|fraud|kidnapping)\b/i,
      /\b(?:synthesize|manufacture|produce|cook) (?:drugs?|meth|cocaine|heroin|fentanyl|LSD|MDMA|DMT)\b/i,
      /\bhow to (?:buy|sell|traffic|smuggle|distribute) (?:drugs?|weapons?|organs?|humans?|slaves?)\b/i,
      /\b(?:suicide|self[- ]?harm) (?:methods?|instructions?|guide|how[- ]?to|ways? to)\b/i,
      /\bwhere to (?:buy|find|get|obtain) (?:illegal|illicit|black market|unlicensed) (?:weapons?|guns?|drugs?|substances?)\b/i,
    ],
  },
];

export default ATTACK_PATTERNS;
