import PropTypes from "prop-types";

function SomeoneMessage({ message, first_name, last_name}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-baby-powder rounded-lg p-3 max-w-[75%]">
        <div className="font-medium">{first_name} {last_name}</div>
        <div>{message}</div>
      </div>
    </div>
  );
}

SomeoneMessage.propTypes = {
  message: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
};

export default SomeoneMessage;
