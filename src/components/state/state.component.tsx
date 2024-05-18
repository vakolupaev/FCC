import GyroscopeComponent from "../gyroscope/gyroscope.component";
import MeterComponent from "../meter";

type StateProps = {
	type: string;
	text?: string;
	size?: string;
}

const StateComponent = (props: StateProps) => {

	const ret = () => {
		switch (props.type) {
			case 'gyro':
				return <GyroscopeComponent />;
			case 'meter':
				return <MeterComponent text={props.text!} size={props.size!} />

			default:
				break;
		}
	}

	return (
		<div
			className="bg-[#1a1a1a] aspect-square w-full rounded-xl"
		>
			{ret()}
		</div>
	)
}

export default StateComponent;
