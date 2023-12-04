const Notification = ({ message, info}) => {
    if (message === []) {
      return null
    }
  
    return (
      <div className={info}>
        {message}
      </div>
    )
  }

export default Notification;