import React from 'react';
import { TextInput, Checkbox } from "components/FormInputs";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import SimpleReactValidator from 'simple-react-validator';

export default class SettingsPlans extends React.Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            newPlan: {
                planId: "",
                displayName: "",
                isPrivate: false
            },
            plans: this.props.plans || []
        }
    }

    planInputKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.onClickAddPlan();
        }
    }

    onClickAddPlan() {
        if (this.validator.allValid()) {
            var plans = [...this.state.plans];
            plans.push({
                planId: this.state.newPlan.planId,
                displayName: this.state.newPlan.displayName,
                isPrivate: this.state.newPlan.isPrivate
            });
            this.setState({ plans: plans, newPlan: { planId: "", displayName: "", isPrivate: false } });
            this.onPlanChange(plans);
            this.validator.hideMessages();
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    planInputChangeHandler(property, value) {
        var newPlan = { ...this.state.newPlan };
        newPlan[property] = value;
        this.setState({ newPlan: newPlan });
    }

    planGridRemoveHandler(plan) {
        var plans = [...this.state.plans];
        plans = plans.filter(x => x !== plan);
        this.setState({ plans: plans });
        this.onPlanChange(plans);
    }

    onPlanChange(plans) {
        this.props.onPlanChange && this.props.onPlanChange(plans)
    }

    render() {
        return (<div>
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <Table striped bordered hover>
                        <tbody>
                            {this.state.plans ?
                                this.state.plans.map(plan => {
                                    return <tr>
                                        <td>{plan.displayName}</td>
                                        <td>{plan.planId}</td>
                                        <td>{String(plan.isPrivate)}</td>
                                        <td style={{ "width": "80px" }}><Button type="button" onClick={(event) => { this.planGridRemoveHandler(plan) }}>Remove</Button></td>
                                    </tr>
                                })
                                : ""}
                        </tbody>
                    </Table>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ backgroundColor: "#303030", padding: "20px", borderRadius: "20px" }}>
                    <div className="col-xs-12">
                        <h5>Add Plan<hr /></h5>
                    </div>
                    <div className="col-xs-12">
                        <TextInput
                            name="displayName" displayName="Display Name" placeholder="Gold plan for Contoso"
                            value={this.state.newPlan.displayName}
                            validator={this.validator} validatorOptions="required"
                            onChangeHandler={(event) => this.planInputChangeHandler("displayName", event.target.value)} onKeyPressHandler={(event) => this.planInputKeyPress(event)} />
                    </div>
                    <div className="col-xs-12">
                        <TextInput
                            name="planId" displayName="Plan Id" placeholder="gold"
                            value={this.state.newPlan.planId}
                            validator={this.validator} validatorOptions="required"
                            onChangeHandler={(event) => this.planInputChangeHandler("planId", event.target.value)} onKeyPressHandler={(event) => this.planInputKeyPress(event)} />
                    </div>
                    <Checkbox
                        name="isPrivate" displayName="Private Plan"
                        checked={this.state.newPlan.isPrivate}
                        onChangeHandler={(event) => this.planInputChangeHandler("isPrivate", !!event.target.checked)}>
                    </Checkbox>
                    <Button type="button" onClick={() => this.onClickAddPlan()}>Add Plan</Button>
                </div>
            </div>
        </div >)
    }
}