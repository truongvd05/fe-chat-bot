// hooks/useFieldValidator.js
import { useEffect, useMemo, useRef } from "react";
import debounce from "lodash.debounce";

function useFieldValidator({ value, validate, onSuccess, onError, regex }) {
  const validateRef = useRef(validate);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    validateRef.current = validate;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  const check = useMemo(() => {
    return debounce(async (val) => {
      if (!val) return;
      if (regex && !regex.test(val)) return;
      try {
        await validateRef.current(val);
        onSuccessRef.current?.();
      } catch (err) {
        onErrorRef.current?.(err);
      }
    }, 800);
  }, []);

  useEffect(() => {
    check(value);
  }, [value, check]);

  useEffect(() => {
    return () => check.cancel();
  }, [check]);
}

export default useFieldValidator;
