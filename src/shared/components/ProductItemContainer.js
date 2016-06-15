var React = require( 'react' );
var ProductItem = require( './ProductItem.js' );

export default React.createClass( {
	render: function() {
		return (
			<ProductItem product={this.props.product}
						 onAddToCartClicked={this.props.onAddToCart.bind(this, this.props.product)} />
		);
	}
} );

