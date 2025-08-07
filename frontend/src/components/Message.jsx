import PropTypes from "prop-types";

function Message({ message, first_name, last_name, sentByCurrentUser }) {

  return (
    <div className={`message ${sentByCurrentUser ? 'sent-by-user' : 'sent-by-others'}`}>
      <div className={`message ${sentByCurrentUser ? 'sent-by-user-a' : 'sent-by-others-a'}`}>
        <div className="font-medium">{first_name} {last_name}</div>
        <div>{message}</div>
      </div>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  sentByCurrentUser: PropTypes.bool.isRequired,
};

export default Message;
