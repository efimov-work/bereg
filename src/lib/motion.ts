const active = new Set<Animation>();
const elements = new WeakMap<Element, Animation>();

export function animate(element: Element | null, frames: Keyframe[], options: KeyframeAnimationOptions = {}) {
    if (!element || !element.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    elements.get(element)?.cancel();
    const animation = element.animate(frames, { duration: 550, easing: 'cubic-bezier(.16,1,.3,1)', ...options });
    elements.set(element, animation);
    active.add(animation);
    animation.finished
        .catch(() => {})
        .finally(() => {
            active.delete(animation);
            if (elements.get(element) === animation) elements.delete(element);
        });
    return animation;
}

export function stopAnimations(finish = false) {
    active.forEach((animation) => (finish ? animation.finish() : animation.cancel()));
}

export function updatePageLock() {
    document.body.classList.toggle(
        'locked',
        !!document.querySelector('dialog[open], .menu-toggle[aria-expanded="true"]')
    );
}
