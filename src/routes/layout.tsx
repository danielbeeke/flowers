import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { RequestHandler } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';

import Header from '~/components/header/header';
import Footer from '~/components/footer/footer';

export const onGet: RequestHandler = ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});

export const head: DocumentHead = ({ params }) => {
  const title = params.term ? `Search flowers for ${params.term}` : 'Search for flowers'

  return {
    title,
    meta: [
      {
        name: 'description',
        content: title,
      },
    ],
  };
};