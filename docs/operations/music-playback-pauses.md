# Music playback pauses, 8 October 2026

Automatic playback now schedules native monophonic synthesizer voices against the audio clock. Interface timers only highlight notes; delayed browser timers cannot issue all sound attacks together. Stop, mute, hiding the page and leaving the studio dispose scheduled voices, cancelling future sound. Free-play keys still react immediately, with shorter release tails.

Saved compositions keep their notes, onset intervals and simultaneous layers. Their note gates end before the next step, with a short release and a quiet interval. No saved composition, learner identity or database schema is rewritten. At the normal 600 millisecond interval, the gate is 420 milliseconds, release 50 milliseconds, leaving 130 milliseconds of silence. Faster stored timing leaves a smaller gap rather than silently changing its onset times.

All ten authored tune sequences retain their notes. A deliberately spaced listening arrangement groups the existing note lines, holds phrase endings longer and adds a half-beat breath between phrases. Listening pace defaults to 80 beats per minute, adjustable 40 to 120. A learner can replay one phrase or the whole tune. This teaching arrangement is not a claim of a fully transcribed musical score. Copy notes continues to copy pitch choices into the draft; phrase timing is not written into compositions. A visible Stop control remains available outside collapsed composition tools.

The shared Button now forwards its supplied aria-label, so saved music's Play controls carry their composition name. Public cache version is 2026-10-08-music-pauses-1. Account compatibility version is unchanged.

Local tests cover native schedule times, future-voice cancellation, all tunes' note preservation and phrase coverage, inter-note/phrase quiet gaps, bounded pace and existing composition/layer onset timing. Real local browser checks exercised scheduling and cancellation for all six instruments, whole-tune listening, phrase navigation/replay, mute cancellation and 320 pixel layout. The temporary isolated rendering route was removed before release. The localhost authentication key-domain error belongs to that isolated local fixture; it does not establish a production auth failure. Physical audio audibility and device usability remain separately unverified.

Final local qualification: type checking, lint, 1,220 tests and production build passed; 110 database tests require isolated CI. Dependency audit found zero vulnerabilities. All 34 security/migration-runner checks passed. No temporary fixture route remains.
