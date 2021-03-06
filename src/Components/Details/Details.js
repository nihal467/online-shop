import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addItemInCart } from "../../Redux/Actions";
import Api from "../../Api";
import Item from "../Item/Item";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";

class ConnectedDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      relatedItems: [],
      quantity: 1,
      item: null,
      itemLoading: false,
    };
  }

  async fetchProductAndRelatedItems(productId) {
    this.setState({ itemLoading: true });

    let item = await Api.getItemUsingID(productId);

    let relatedItems = await Api.searchItems({
      category: item.category,
    });

    this.setState({
      item,
      quantity: 1,
      relatedItems: relatedItems.data.filter((x) => x.id !== item.id),
      itemLoading: false,
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If ID of product changed in URL, refetch details for that product
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchProductAndRelatedItems(this.props.match.params.id);
    }
  }

  componentDidMount() {
    this.fetchProductAndRelatedItems(this.props.match.params.id);
  }

  render() {
    if (this.state.itemLoading || !this.state.item) {
      return <CircularProgress className="circular" />;
    }

    return (
      <div style={{ padding: 10 }}>
        <div
          style={{
            marginTop: 10,
            marginBottom: 20,
            fontSize: 22,
          }}
        >
          {this.state.item.name}
        </div>
        <div style={{ display: "flex" }}>
          <img
            src={this.state.item.imageUrls[0]}
            alt=""
            width={250}
            height={250}
            style={{
              border: "1px solid lightgray",
              borderRadius: "5px",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 16,
              }}
            >
              Price: {this.state.item.price} $
            </div>

            {this.state.item.popular && (
              <div style={{ fontSize: 14, marginTop: 5, color: "#228B22" }}>
                (Popular product)
              </div>
            )}

            <TextField
              type="number"
              value={this.state.quantity}
              style={{ marginTop: 20, marginBottom: 10, width: 70 }}
              label="Quantity"
              inputProps={{ min: 1, max: 10, step: 1 }}
              onChange={(e) => {
                this.setState({ quantity: parseInt(e.target.value) });
              }}
            />
            <Button
              style={{ width: 170, marginTop: 5 }}
              color="primary"
              variant="outlined"
              onClick={() => {
                this.props.dispatch(
                  addItemInCart({
                    ...this.state.item,
                    quantity: this.state.quantity,
                  })
                );
              }}
            >
              Add to Cart <AddShoppingCartIcon style={{ marginLeft: 5 }} />
            </Button>
          </div>
        </div>

        {/* Product description */}
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            fontSize: 22,
          }}
        >
          Product Description
        </div>
        <div
          style={{
            maxHeight: 200,
            fontSize: 13,
            overflow: "auto",
          }}
        >
          {this.state.item.description
            ? this.state.item.description
            : "Not available"}
        </div>

        {/* Relateditems */}
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            fontSize: 22,
          }}
        >
          Related Items
        </div>
        {this.state.relatedItems.length ? (
          this.state.relatedItems.slice(0, 3).map((x) => {
            return <Item key={x.id} item={x} />;
          })
        ) : (
          <div style={{ fontSize: 13 }}>Not available</div>
        )}
      </div>
    );
  }
}

let Details = connect()(ConnectedDetails);
export default Details;
