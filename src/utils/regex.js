const regex = {
  basicEmailRegex: /^(?!\.)([A-Z0-9._%+-]+)@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  syllabEmailRegex: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?syllab\.in$/,
  password:
    /^.*(?=.{10,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
};

export default regex;
