
import MUI from 'mui-datatables'
import React, { Component } from 'react'
import { checkSquareO } from 'react-icons-kit/fa/checkSquareO'
import { trashO } from 'react-icons-kit/fa/trashO'
import { Button, Modal } from 'react-bootstrap'
import Icon from 'react-icons-kit'
import { close } from 'react-icons-kit/fa/close'
import ErrorAlert from '../../ErrorAlert'
import SuccessAlert from '../../SuccessAlert'
import Swal from 'sweetalert2'
import { pencil } from 'react-icons-kit/fa/pencil';
import catCtrl from '../controllers/item.controller'

export class Category extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ItemCategories: [],
            ID:0,
            Name: '',
            Description: '',
            Show:false,
            Submit:'Register'
        }
    }

    handleClose = () => this.setState({Show:false});
    handleShow = () => this.setState({Show:true});
    handleName = event => this.setState({ Name: event.target.value });
    handleDescription = event => this.setState({ Description: event.target.value });




    getCategories = async () =>{
        let result = await catCtrl.getAll("getCategoires")
        if(result){
            this.setState({ItemCategories:result})
        }
    }

    componentDidMount = async () => {
        await this.getCategories();
    }
    updateModal = (id) =>{
        let  category  = this.state.ItemCategories.find(i => i.id === id); 
        this.setState({
            ID:category.id,
            Name:category.name,
            Description:category.description,
            Show:true,
            Submit:'Update'
        })
    }
    deleteCategory = async (id) => {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

    insertCategoryType = async event => {
        event.preventDefault();
        let obj = {Name:this.state.Name,Description:this.state.Description};
        let result = await catCtrl.insert("insertCategory",obj);
        if(result === true){
            SuccessAlert("Register Successful");
        }else{
            ErrorAlert("Something went wrong");
        }
    }
    if(result.isConfirmed){
        let response = await catCtrl.delete("deleteCategory",id);
        if(response){
            Swal.fire(
              'Deleted!',
              'Category has been deleted.',
              'success'
            );
            window.location.reload();
        }else{
            ErrorAlert(response.Error);
        }
    }
}

    

    render() {
        let columns = ["ID", "Name", "Description", "Update", "Delete"]
        return (
            <div className="container-fluid" style={{ marginTop: "30px" }}>
               
                <div className="row">
                    <div className="col-sm-12">
                        <Button variant="primary" onClick={this.handleShow} style={{width: "200px"}}>
                            Insert Item Category <Icon icon={checkSquareO}></Icon>
                        </Button>
                        <MUI
                            title="Item Category"
                            data={
                                this.state.ItemCategories.map(d => {
                                    let array = [
                                        d.id, d.name, d.description,
                                        <button className="btn btn-primary" onClick={this.updateModal.bind(this,d.id)} >Update <Icon icon={checkSquareO}/></button>,
                                        <button className="btn btn-danger" onClick={deleteCategory.bind(this,d.id)} >Delete <Icon icon={trashO}/></button>
                                    ]
                                    return array;
                                })
                            }
                            columns={columns}
                        />
                    </div>
                </div>
              
                <div className="row">
                    <div className="col-sm-12">
                        <Modal show={this.state.Show} onHide={this.handleClose}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    {
                                        `${this.state.Submit} Item Category`
                                    }
                                </Modal.Title>
                            </Modal.Header>
                            <form id="myForm" method="post" onSubmit={this.insertCategoryType}>
                                <Modal.Body>
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-sm-12 form-group">
                                                <label>Category Name</label>
                                                <input type="text" placeholder="Category Name" className="form-control"
                                                    onChange={this.handleName} value={this.state.Name} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <textarea rows="7" className="form-control" placeholder="Description"
                                                    onChange={this.handleDescription} value={this.state.Description} >

                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button id="submit" type="submit" className="float-left btn btn-primary">{this.state.Submit} <Icon icon={checkSquareO}></Icon></button>
                                    <Button className="btn btn-danger" onClick={this.handleClose}>Close <Icon icon={close} style={{ marginTop: "-10px" }}></Icon></Button>
                                </Modal.Footer>
                            </form>
                        </Modal>
                    </div>
                </div>

            </div>
        )
    }
}


export default Category
