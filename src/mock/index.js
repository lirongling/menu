import Mock from 'mockjs'
import menu from '../data/data'

Mock.mock('/api/menu', 'get', { data: menu })