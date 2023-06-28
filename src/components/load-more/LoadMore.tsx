import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

export const LoadMore = component$(({ action$ }: { action$: PropFunction<() => void> }) => {
    const outputRef = useSignal<Element>();
    useVisibleTask$(() => {
          const observer = new IntersectionObserver((event) => {
            if (event[0]?.isIntersecting) action$()
          });
          
          observer.observe(outputRef.value!)
    })
    return <span ref={outputRef}>Loading ...</span>
})