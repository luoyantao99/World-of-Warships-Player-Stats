from django.test import TestCase, Client
from django.urls import reverse

class PlayerStatsTestCase(TestCase):

    def setUp(self):
        # Setup run before every test method.
        self.client = Client()

    def test_search_players(self):
        # Ensure the search_players view returns a 200 response and the correct data.
        response = self.client.get(reverse('search_players'), {'search': 'test_query'})
        self.assertEqual(response.status_code, 200)
        # Check if the response contains the expected keys
        self.assertIn('data', response.json())