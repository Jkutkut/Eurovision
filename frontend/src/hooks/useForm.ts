import {useState} from "react";

const useForm = (initialValues = {}) => {
  const [formState, setFormState] = useState(initialValues);

  const onChange = ({target}: any) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value
    });
  };
  return {
    ...formState,
    formState,
    onChange
  };
};

export default useForm;
