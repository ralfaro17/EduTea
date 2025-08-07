import PropTypes from 'prop-types';

function OwnMessage({ message, first_name, last_name }) {
  return (
    <div className="justify-end ">
      <div>
        <div className="font-medium">{first_name} {last_name}</div>
        <div>{message}</div>
      </div>
    </div>
  );
}

OwnMessage.propTypes = {
  message: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
};

export default OwnMessage;
