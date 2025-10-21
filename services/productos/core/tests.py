class CategoryModelTestCase(TestCase):
    def setUp(self):
        self.category_data = {
            'name': 'Electrónica',
            'slug': 'electronica',
            'description': 'Productos electrónicos',
        }
    
    def test_create_category(self):
        category = Category.objects.create(**self.category_data)
        self.assertEqual(category.name, self.category_data['name'])