from django.db import models
from django.urls import reverse

class School(models.Model):
	name = models.CharField(max_length=256)
	principal = models.CharField(max_length=256)
	location = models.CharField(max_length=256)

	def __str__(self):
		return self.name

	# An absolute url on a model will redirect to a newly created model entry if a redirect url after creation is not specified.
	def get_absolute_url(self):
		return reverse('cbvs_app:detail', kwargs={'pk': self.pk})


class Student(models.Model):
	name = models.CharField(max_length=256)
	age = models.PositiveIntegerField()
	school = models.ForeignKey(School, related_name='students', on_delete='models.CASCADE')

	def __str__(self):
		return self.name