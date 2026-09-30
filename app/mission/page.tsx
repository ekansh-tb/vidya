import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our mission | Vidya",
  description:
    "Free learning for every child and a lifelong learning vision: every curriculum worldwide, school through university and beyond, with independent adult learning.",
};

const focus =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#17294d]";
const action =
  `inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[#2446b5] px-5 py-3 text-center font-bold ${focus}`;

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-[#f5f8ff] font-sans text-[#17294d] selection:bg-[#ffdc68]">
      <a
        href="#mission-content"
        className={`sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-4 ${focus}`}
      >
        Skip to our mission
      </a>
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-[#78849c] pb-6">
          <Link href="/" aria-label="Vidya learning home" className={`rounded text-3xl font-extrabold tracking-tight ${focus}`}>
            <span aria-hidden="true" className="me-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ffdc68]">v</span>
            vidya
          </Link>
          <nav aria-label="Mission page" className="flex flex-wrap gap-5 text-sm font-semibold">
            <a href="#our-promise" className={`inline-flex min-h-11 items-center rounded underline underline-offset-4 ${focus}`}>Our promise</a>
            <a href="#choose-a-door" className={`inline-flex min-h-11 items-center rounded underline underline-offset-4 ${focus}`}>Choose a door</a>
          </nav>
        </header>

        <main id="mission-content" tabIndex={-1} className="outline-none">
          <section aria-labelledby="mission-title" className="grid gap-8 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-widest">Free learning for every child</p>
              <h1 id="mission-title" className="max-w-[15ch] text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
                A world to open.<br />A world to question.
              </h1>
            </div>
            <div className="max-w-prose space-y-5 text-lg leading-relaxed">
              <p>Vidya’s mission begins with free learning for every child and extends through university and throughout life.</p>
              <p>Our vision includes every curriculum worldwide and learners at all universities. One shared world where children explore, parents guide and adults continue learning independently. Books, lessons, practice and activities come first.</p>
            </div>
          </section>

          <section id="choose-a-door" aria-labelledby="doors-title" className="scroll-mt-8">
            <h2 id="doors-title" className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Two doors. A shared possibility.</h2>
            <div className="grid overflow-hidden rounded-t-[2rem] rounded-b-xl border-2 border-[#17294d] shadow-[0_8px_0_#e7e1ff] md:grid-cols-2">
              <article className="flex flex-col items-start border-b-2 border-[#17294d] bg-[#e7e1ff] p-6 sm:p-10 md:border-b-0 md:border-e-2">
                <p className="mb-6 text-sm font-bold uppercase tracking-widest">The child door</p>
                <h3 className="mb-4 text-3xl font-bold tracking-tight">Bring your questions.</h3>
                <p className="mb-5 text-lg leading-relaxed">Open a book. Try a lesson. Practise an idea. Explore an activity. You can change your mind, try again or say “I don’t know yet.”</p>
                <p className="mb-8 leading-relaxed">You do not have to become a copy of the adults around you. There is room to discover what you think and who you want to be.</p>
                <Link href="/" className={`${action} mt-auto bg-[#2446b5] text-white hover:border-[#17294d] hover:bg-[#17294d]`}>Start learning</Link>
                <p className="mt-4 text-sm leading-relaxed">Free core learning. Optional AI is not required.</p>
              </article>
              <article className="flex flex-col items-start bg-white p-6 sm:p-10">
                <p className="mb-6 text-sm font-bold uppercase tracking-widest">The parent door</p>
                <h3 className="mb-4 text-3xl font-bold tracking-tight">Make room for curiosity.</h3>
                <p className="mb-5 text-lg leading-relaxed">Offer context, listen to questions and guide the use of AI. Learn alongside your child without needing to have every answer.</p>
                <p className="mb-8 leading-relaxed">Parent access starts with a separate sign-in and an explicit learner link. Choosing this door does not automatically give access to a child’s information.</p>
                <Link href="/parent" className={`${action} mt-auto bg-white text-[#2446b5] hover:bg-[#e7e1ff]`}>Open parent space</Link>
                <p className="mt-4 text-sm leading-relaxed">Parents choose whether to enable and fund optional AI.</p>
              </article>
            </div>
          </section>

          <section aria-labelledby="lifelong-title" className="mt-10 rounded-xl border border-[#78849c] bg-white p-6 sm:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest">School, university and beyond</p>
            <h2 id="lifelong-title" className="mb-5 text-3xl font-bold tracking-tight">Learning does not end at the school door.</h2>
            <div className="max-w-prose space-y-5 text-lg leading-relaxed">
              <p>CBSE, ICSE, Cambridge and IGCSE are starting examples, not a geographic limit. Cambridge programmes, including IGCSE, belong in our international vision, not an India-only category.</p>
              <p>We aim to support university study and lifelong learning across disciplines and institutions. This is a direction for building, not a claim of university content, partnerships, accreditation, translations or verified worldwide availability.</p>
              <h3 className="text-xl font-bold">An independent path for adult learners</h3>
              <p>Our planned adult learner experience puts adults in charge of their own learning and sharing, without required guardian monitoring. University enrollment alone does not determine whether someone is an adult.</p>
              <p>Child safeguards remain essential. Moving from a child profile to independent adult access will require an explicit, informed transition after eligibility is established, including review of existing parent access and consent for any continued sharing.</p>
              <p className="text-base">The independent adult path and university learning experience are planned, not available through a new enrollment flow on this page.</p>
            </div>
          </section>

          <section aria-labelledby="generations-title" className="grid gap-6 border-b border-[#78849c] py-14 sm:py-20 md:grid-cols-[1fr_1.2fr] md:gap-14">
            <h2 id="generations-title" className="max-w-[20ch] text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Each generation can ask a new question.</h2>
            <div className="space-y-5 text-lg leading-relaxed">
              <p>Parents guide AI. AI helps children learn. Children grow into adults who can guide the next generation, alongside AI. Parents also learn from their children and from the experience of guiding.</p>
              <p>Adults can pass on knowledge, care and experience. Children can examine those ideas, find new evidence and imagine different futures.</p>
              <p>Our hope is that learning across generations helps us understand one another and take better care of our shared world. That is an aspiration, not a guaranteed outcome.</p>
              <p>No teacher, parent or AI has every answer. A useful learning companion leaves space for doubt, disagreement and independent thought.</p>
            </div>
          </section>

          <section id="our-promise" aria-labelledby="promise-title" className="scroll-mt-8 py-14 sm:py-20">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest">What we are building toward</p>
            <h2 id="promise-title" className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">An open door, with honest limits.</h2>
            <dl className="grid gap-x-12 gap-y-9 md:grid-cols-2">
              <div>
                <dt className="mb-3 text-xl font-bold">Core learning stays free</dt>
                <dd className="leading-relaxed">Lessons, practice, books and activities are the foundation. For children, optional AI is parent funded unless sponsorship is approved. The planned adult path would let adults choose their own optional AI funding without requiring a parent. Sponsored AI is not promised to every learner.</dd>
              </div>
              <div>
                <dt className="mb-3 text-xl font-bold">Culture is not a preset</dt>
                <dd className="leading-relaxed">A language or nationality should not decide a learner’s curriculum, interests or future. Our aim is to support explicit choices from school curricula to university courses and accessible experiences across cultures. Coverage is incomplete; a programme’s place in our vision does not mean its content is available today.</dd>
              </div>
              <div>
                <dt className="mb-3 text-xl font-bold">Questions matter more than certainty</dt>
                <dd className="leading-relaxed">AI can be wrong. Compare explanations with books, evidence and people you trust. Vidya does not promise perfect teaching or a particular learning result.</dd>
              </div>
              <div>
                <dt className="mb-3 text-xl font-bold">Activity is not identity</dt>
                <dd className="leading-relaxed">An answer or a reading session is one observation, not a verdict on a child. Our design goal is to distinguish recorded activity from interpretation and make parent links and information sharing understandable.</dd>
              </div>
            </dl>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-[#78849c] py-7 text-sm leading-relaxed">
          <p>One world. One app. Free learning for every child.</p>
          <Link href="/" className={`inline-flex min-h-11 items-center rounded font-semibold underline underline-offset-4 ${focus}`}>Go to learning</Link>
        </footer>
      </div>
    </div>
  );
}
