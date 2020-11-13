import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Row, Table, Label, Input} from 'reactstrap';
import {Translate, ICrudGetAllAction, TextFormat} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {IRootState} from 'app/shared/reducers';
import {getEntities} from './book.reducer';
import {IBook} from 'app/shared/model/book.model';
import {APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT} from 'app/config/constants';

import {getEntities as getAuthors} from 'app/entities/author/author.reducer';
import {AvFeedback, AvForm, AvGroup, AvInput, AvField} from 'availity-reactstrap-validation';
import MultiSelect from "react-multi-select-component";

export interface IBookProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
}

export const Book = (props: IBookProps) => {
  useEffect(() => {
    props.getEntities();
    props.getAuthors()
  }, []);

  const {authors, bookList, match, loading} = props;

  const [title, settitle] = useState('');
  const [description, setdescription] = useState('');
  const [price, setprice] = useState(0);
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('');
  const [authorId, setauthorId] = useState([]);
  const [selected, setselected] = useState([]);
  const filterHandle = (e, filterType) => {
    switch (filterType) {
      case "title":
        settitle(e.target.value)
        break;
      case "description":
        setdescription(e.target.value)
        break;
      case "price":
        setprice(e.target.value)
        break;
      case "endDate":
        setendDate(e.target.value)
        break;
      case "startDate":
        setstartDate(e.target.value)
        break;
      case "authorId":
        setauthorId(e.map(a => a.value))
        setselected(e)
        break;
      default:
        break;
    }
  }
  const [filtered, setfiltered] = useState([])
  useEffect(() => {
    if (title !== "") {
      setfiltered(
        bookList.filter(country => {
          return country.title.toLowerCase().includes(title.toLowerCase())
        }))
    } else if (description !== "") {
      setfiltered(
        bookList.filter(country => {
          return country.description.toLowerCase().includes(description.toLowerCase())
        }))
    } else if (price !== 0) {
      setfiltered(
        bookList.filter(country => {
          return country.price.toString().includes(price.toString())
        }))
    } else if (startDate !== "") {
      setfiltered(
        bookList.filter(country => {
          return country.publicationDate >= (startDate)
        })
      )
    } else if (endDate !== "") {
      setfiltered(
        bookList.filter(country => {
          return country.publicationDate <= (endDate)
        })
      )
    } else if (authorId.length > 0) {
      setfiltered(
        bookList.filter(country =>
          country.authors.find(e => authorId.find(r => r === e.id))
        )
      )
    } else {
      setfiltered(bookList.map(e => e))
    }

  }, [title, description, price, startDate, endDate, selected, authorId, bookList])


  const options = authors.map(e => ({label: e.name, value: e.id}))

  return (
    <div>
      <h2 id="book-heading">
        <Translate contentKey="reactApp.book.home.title">Books</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus"/>
          &nbsp;
          <Translate contentKey="reactApp.book.home.createLabel">Create new Book</Translate>
        </Link>
      </h2>
      <AvForm>
        <div>
          <div>
            <Label id="nameLabel" for="book-title">
              <Translate contentKey="reactApp.book.title">Title</Translate>
            </Label>
            <input type="search" name="title" className="form-control" onChange={(e) => filterHandle(e, "title")}/>
          </div>
          <div>
            <Label id="nameLabel" for="book-description">
              <Translate contentKey="reactApp.book.description">Description</Translate>
            </Label>
            <input type="search" className="form-control" name="description"
                   onChange={(e) => filterHandle(e, "description")}/>
          </div>
          <div>
            <Label id="nameLabel" for="book-price">
              <Translate contentKey="reactApp.book.price">Price</Translate>
            </Label>
            <input type="search" className="form-control" name="price" onChange={(e) => filterHandle(e, "price")}/>
          </div>
          <div>
            <Label id="birthDateLabel" for="book-publicationDate">
              <Translate contentKey="reactApp.book.publicationDate">Publication Date</Translate>
            </Label>
            <Input type="date" name="fromDate" id="fromDate" onChange={(e) => filterHandle(e, "startDate")}/>
            <span>
              <Label>To</Label>
            </span>
            <Input type="date" onChange={(e) => filterHandle(e, "endDate")}/>
          </div>
          <div>
            <Label for="book-author">
              <Translate contentKey="reactApp.book.author">Author</Translate>
            </Label>
            <MultiSelect
              options={options}
              value={selected}
              onChange={(e) => filterHandle(e, "authorId")}
              //
              labelledBy={"Select"}
            />
          </div>
          <div className="table-responsive">
            {bookList && bookList.length > 0 ? (
              <Table responsive>
                <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="reactApp.book.title">Title</Translate>
                  </th>
                  <th>
                    <Translate contentKey="reactApp.book.description">Description</Translate>
                  </th>
                  <th>
                    <Translate contentKey="reactApp.book.publicationDate">Publication Date</Translate>
                  </th>
                  <th>
                    <Translate contentKey="reactApp.book.price">Price</Translate>
                  </th>
                
                  <th/>
                </tr>
                </thead>
                <tbody>
                {filtered.map((book, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${book.id}`} color="link" size="sm">
                        {book.id}
                      </Button>
                    </td>
                    <td>{book.title}</td>
                    <td>{book.description}</td>
                    <td>
                      {book.publicationDate ?
                        <TextFormat type="date" value={book.publicationDate} format={APP_LOCAL_DATE_FORMAT}/> : null}
                    </td>
                    <td>{book.price}</td>
                    
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${book.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye"/>{' '}
                          <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${book.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt"/>{' '}
                          <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${book.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash"/>{' '}
                          <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </Table>
            ) : (
              !loading && (
                <div className="alert alert-warning">
                  <Translate contentKey="reactApp.book.home.notFound">No Books found</Translate>
                </div>
              )
            )}
          </div>
        </div>
      </AvForm>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  bookList: storeState.book.entities,
  loading: storeState.book.loading,
  authors: storeState.author.entities,
});


const mapDispatchToProps = {
  getEntities,
  getAuthors
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Book);
