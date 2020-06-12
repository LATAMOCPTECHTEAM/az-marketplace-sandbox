import React from 'react';
import TextInput from "components/FormInputs/TextInput";
import Button from "components/FormInputs/Button";
import Table from "react-bootstrap/Table";

export default class SettingsPlans extends React.Component {

    state = {
        planInput: "",
        plans: this.props.plans || []
    }

    planInputKeyPressHandler(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            var plans = [...this.state.plans];
            plans.push(this.state.planInput);
            this.setState({ plans: plans, planInput: "" });
            this.onPlanChange(plans);
        }
    }

    planInputChangeHandler(event) {
        this.setState({ planInput: event.target.value });
    }

    planGridRemoveHandler(plan) {
        var plans = [...this.state.plans];
        plans = plans.filter(x => x !== plan);
        this.setState({ plans: plans });
        this.onPlanChange(plans);
    }

    onPlanChange(plans) {
        if (this.props.onPlanChange) {
            this.props.onPlanChange(plans);
        }
    }

    render() {
        let displayCols = "col col-xs-12 col-sm-12 col-md-4 col-lg-1";
        return (<div>
            <TextInput displayCols={displayCols} inputCols="col col-xs-12 col-sm-12 col-md-4 col-lg-4"
                name="planInput" displayName="Add PlanId"
                value={this.state.planInput}
                onChangeHandler={(event) => this.planInputChangeHandler(event)}
                onKeyPressHandler={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        this.planInputKeyPressHandler(event);
                    }
                }} />
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-5">
                    <Table striped bordered hover>
                        <tbody>
                            {this.state.plans ?
                                this.state.plans.map(plan => {
                                    return <tr><td>{plan}</td><td style={{ "width": "80px" }}><Button text="Remove" type="button" onClick={(event) => { this.planGridRemoveHandler(plan) }} /></td></tr>
                                })
                                : ""}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div >)
    }
}