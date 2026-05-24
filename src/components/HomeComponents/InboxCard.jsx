import "./HomeComponents.css"

export default function Inbox () {

    function displayMessage () {
        // Logic to navigate to the message details page or open a modal with the message content
    }

    function inputReply () {

    }

    function sendReply () {

    }
    return (
        <section className="inbox-container">
        <div onclick={displayMessage} >
            <div className="inbox-header">
               <span classNmae="message-sender"></span>
            </div>

            <div className="message-title">
                <span className="message-subject"></span>
            </div>

            <div className="timestamp">
                <span className="message-timestamp"></span>
            </div>

            <div className="message-content">
                <button onclick={displayMessage} className="message-snippet"></button>
            </div>
        </div>

        <div>
            <div className="message-display">
                <p></p>
                <button onclick={inputReply}>reply</button>
            </div>
        </div>

        <div className="reply-form">
            <input
             type="text"
             className="message-title" />
            <input 
             type="text"
             className="message-contents" />
            <button onclick={sendReply}></button>
        </div>
        </section>
    );
}