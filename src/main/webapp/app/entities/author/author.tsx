import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Button, Col, Row, Table} from 'reactstrap';
import {Translate, ICrudGetAllAction, TextFormat} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {IRootState} from 'app/shared/reducers';
import {getEntities} from './author.reducer';
import {IAuthor} from 'app/shared/model/author.model';
import {APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT} from 'app/config/constants';

import {getEntities as getBooks} from 'app/entities/book/book.reducer';
import MultiSelect from "react-multi-select-component";
import {Label, Input} from 'reactstrap';
import {AvFeedback, AvForm, AvGroup, AvInput, AvField} from 'availity-reactstrap-validation';

export interface IAuthorProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {
}

export const Author = (props: IAuthorProps) => {
  useEffect(() => {
    props.getEntities();
    props.getBooks()
  }, []);

  const {books, authorList, match, loading} = props;
  const [selected, setselected] = useState([]);
  const options = books.map(e => ({label: e.title, value: e.id}))

  const [name, setname] = useState('');
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('');
  const [bookId, setbookId] = useState([]);
  const filterHandle = (e, filterType) => {
    switch (filterType) {
      case "name":
        setname(e.target.value)
        break;
      case "endDate":
        setendDate(e.target.value)
        break;
      case "startDate":
        setstartDate(e.target.value)
        break;
      case "bookId":
        setbookId(e.map(a => a.value))
        setselected(e)
        break;
      default:
        break;
    }
  }
  const [filtered, setfiltered] = useState([])
  useEffect(() => {
    if (name !== "") {
      setfiltered(
        authorList.filter(country => {
          return country.name.toLowerCase().includes(name.toLowerCase())
        }))
    } else if (startDate !== "") {
      setfiltered(
        authorList.filter(country => {
          return country.birthDate >= (startDate)
        })
      )
    } else if (endDate !== "") {
      setfiltered(
        authorList.filter(country => {
          return country.birthDate <= (endDate)
        })
      )
    } else if (bookId.length > 0) {
      setfiltered(
        authorList.filter(e => bookId.find(r => r === e.id))
      )
    } else {
      setfiltered(authorList.map(e => e))
    }

  }, [name, startDate, endDate, selected, bookId, authorList])
  return (
    <div>
      <h2 id="author-heading">
        <Translate contentKey="reactApp.author.home.title">Authors</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus"/>
          &nbsp;
          <Translate contentKey="reactApp.author.home.createLabel">Create new Author</Translate>
        </Link>
      </h2>
      <AvForm>
        <div>
          <div>
            <Label id="nameLabel" for="author-name">
              <Translate contentKey="reactApp.author.name">Name</Translate>
            </Label>
            <input type="search" name="name" className="form-control" onChange={(e) => filterHandle(e, "name")}/>
          </div>

          <div className="form-group">
            <Label class="form-control-label" id="birthDateLabel" for="book-birthDate">
              <Translate contentKey="reactApp.author.birthDate">Birth Date</Translate>
            </Label>
            <Input type="date" name="fromDate" id="fromDate" className="form-control-label"
                   onChange={(e) => filterHandle(e, "startDate")}/>
            <span>
              <Label>To</Label>
            </span>
            <Input type="date" className="form-control-label" onChange={(e) => filterHandle(e, "endDate")}/>
          </div>
          <div>
            <Label for="book-author">
              <Translate contentKey="reactApp.author.book">Book</Translate>
            </Label>
            <MultiSelect
              options={options}
              value={selected}
              onChange={(e) => filterHandle(e, "bookId")}

              labelledBy={"Select"}
            />
          </div>
          <div className="table-responsive">
            {authorList && authorList.length > 0 ? (
              <Table responsive>
                <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="reactApp.author.name">Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="reactApp.author.birthDate">Birth Date</Translate>
                  </th>
                  <th/>
                </tr>
                </thead>
                <tbody>
                {filtered.map((author, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${author.id}`} color="link" size="sm">
                        {author.id}
                      </Button>
                    </td>
                    <td>{author.name}</td>
                    <td>{author.birthDate ?
                      <TextFormat type="date" value={author.birthDate} format={APP_LOCAL_DATE_FORMAT}/> : null}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${author.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye"/>{' '}
                          <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${author.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt"/>{' '}
                          <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${author.id}/delete`} color="danger" size="sm">
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
                  <Translate contentKey="reactApp.author.home.notFound">No Authors found</Translate>
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
  authorList: storeState.author.entities,
  loading: storeState.author.loading,
  books: storeState.book.entities,
});

const mapDispatchToProps = {
  getEntities,
  getBooks
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Author);
