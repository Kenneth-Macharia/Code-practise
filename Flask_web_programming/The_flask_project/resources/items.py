''' This module contains the items resources '''

import sqlite3
from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from models.item import ItemModel

class Item(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('price', type=float, required=True, help='This field cant be left blank!')

    @jwt_required()
    def get(self, name):
        if ItemModel.find_item_by_name(name):
            return ItemModel.find_item_by_name(name).json()
        return {'Response':'Item {} does not exist'.format(name)}, 404

    @jwt_required()
    def post(self, name):
        if ItemModel.find_item_by_name(name):
            return {'Response':'Item {} already exists'.format(name)}, 400

        response_data = Item.parser.parse_args()
        item_to_add = ItemModel(name, response_data['price'])

        item_to_add.insert_item()
        return {'Response':'Item {} created'.format(name)}, 201

    @jwt_required()
    def delete(self, name):
        if ItemModel.find_item_by_name(name) is None:
            return {'Response':'Item {} does not exist'.format(name)}, 400

        connection = sqlite3.connect('test.db')
        cursor = connection.cursor()

        delete_item_query = "DELETE FROM items_table WHERE name=?"
        cursor.execute(delete_item_query, (name,))

        connection.commit()
        connection.close()

        return {'Response':'Item {} deleted'.format(name)}, 200

    @jwt_required()
    def put(self, name):
        response_data = Item.parser.parse_args()
        item_to_add_or_update = ItemModel(name, response_data['price'])

        if ItemModel.find_item_by_name(name):
            item_to_add_or_update.update_item()
            return {'Response':'Item {} updated'.format(name)}, 200

        item_to_add_or_update.insert_item()
        return {'Response':'Item {} created'.format(name)}, 201


class Items(Resource):
    @jwt_required()
    def get(self):
        connection = sqlite3.connect('test.db')
        cursor = connection.cursor()

        get_all_query = "SELECT * FROM items_table"
        result = cursor.execute(get_all_query)

        items = []

        for row in result:
            items.append({'name':row[0], 'price':row[1]})

        connection.close()

        return {'All database items':items}, 200
