from unittest.mock import patch
from django.test import TestCase, Client
from django.urls import reverse

class PlayerStatsTestCase(TestCase):

    def setUp(self):
        self.client = Client()

    @patch('playerstats.views.requests.get')
    def test_search_players(self, mock_get):
        # Configure the mock to return a response with an OK status code and some test data
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'data': 'some_test_data'}

        # Call the view function
        response = self.client.get(reverse('search_players'), {'search': 'test_query'})

        # Assert that the response contains the expected content
        self.assertEqual(response.status_code, 200)
        self.assertIn('data', response.json())