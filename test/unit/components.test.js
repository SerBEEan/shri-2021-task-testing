import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';
import { ProductItem } from '../../src/client/components/ProductItem';
import { ProductDetails } from '../../src/client/components/ProductDetails';
import { Cart } from '../../src/client/pages/Cart';

const PRODUCT = { id: 1, name: 'product 1', price: 1000, color: 'red', description: 'description', material: 'brick' };
const PRODUCT_SHORT_INFO = { id: 1, name: 'product 1', price: 1000 };

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: () => ({
        [1]: { name: 'product 1', price: 1000, count: 1 },
        [2]: { name: 'product 2', price: 800, count: 2 },
        [3]: { name: 'product 3', price: 1500, count: 1 },
    }),
}));


describe('компоненты', () => {
    it('снимок карточки товара', () => {
        const wrapper = shallow(<ProductItem product={PRODUCT_SHORT_INFO} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('снимок страницы с деталями товара', () => {
        const wrapper = shallow(<ProductDetails product={PRODUCT} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('снимок корзины с добавленными товарами', () => {
        const wrapper = shallow(<Cart />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('считается общая сумма товаров в корзине', () => {
        const wrapper = shallow(<Cart />);

        const allPrice = wrapper.find('.Cart-OrderPrice').text();

        expect(allPrice).toEqual('$4100');
    });
});
