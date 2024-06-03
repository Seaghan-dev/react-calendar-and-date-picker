/**
 * Allows to use multiple refs on a single React element.
 * Supports both functions and ref objects created using createRef() and useRef().
 *
 * Usage:
 * ```jsx
 * <div ref={mergeRefs(ref1, ref2, ref3)} />
 * ```
 *
 * @param {...Array<Function|Object>} inputRefs Array of refs
 */
export function mergeRefs(...inputRefs) {
    return (ref) => {
        inputRefs.forEach((inputRef) => {
            if (!inputRef) {
                return;
            }

            if (typeof inputRef === 'function') {
                inputRef(ref);
            } else {
                // eslint-disable-next-line no-param-reassign
                inputRef.current = ref;
            }
        });
    };
} 

// Reference: https://gist.github.com/wojtekmaj/3848f00c1dc78bfa0686bec96fef9608