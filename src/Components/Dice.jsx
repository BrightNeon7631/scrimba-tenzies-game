export default function Dice(props) {
    const dotsElements = () => {
        const dotsArray = [];
        for (let i = 0; i < props.value; i++) {
            dotsArray.push(<div key={i} className="dot"></div>)
        }
        return dotsArray;
    }

    return (
      <div 
        className={`dice ${props.isHeld ? 'green' : ''} face-${props.value}`}
        onClick={() => props.handleClick(props.id)}
      >
        {dotsElements()}
      </div>
    );
}